from flask import Flask, jsonify, request, session,send_file,  url_for, render_template_string, send_from_directory
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import datetime
import psycopg2.errors
from twilio.rest import Client
from flask_mail import Mail, Message
import smtplib
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
import os
from werkzeug.utils import secure_filename
from datetime import datetime
import re
import subprocess
import traceback
from flask_socketio import SocketIO, emit
import jwt
from functools import wraps

#from flask_bcrypt import Bcrypt
#from flask_session import Session

app=Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['SESSION_TYPE'] = 'filesystem'
CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/condoflow_db'
db = SQLAlchemy(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'osvaldogui744@gmail.com'
app.config['MAIL_PASSWORD'] = 'yppx noaw antc jbto'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)
app.secret_key = 'c510954aea2ee2de74d8c359'
SECRET_KEY = 'c510954aea2ee2de74d8c359'

# Função de autenticação

def authentication(username, password):
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT * FROM tb_admin WHERE email_admin = %s AND senha_admin = %s""", (username, password))
        admin_data = cursor.fetchone()
        
        if admin_data:
            return ["admin", admin_data[2]]
        
        cursor.execute("""SELECT * FROM pessoa, usuario WHERE 
                          pessoa.id_pessoa = usuario.fk_pessoa AND email = %s AND senha_usuario = %s""", (username, password))
        morador_data = cursor.fetchone()
        
        if morador_data:
            return ["morador", morador_data[0]]
        
        cursor.execute("""SELECT * FROM porteiro WHERE 
                           email_porteiro = %s AND senha_porteiro = %s """, (username, password))
        porteiro_data = cursor.fetchone()
        
        if porteiro_data:
            return ["porteiro", porteiro_data[0]]
        
        return None
    except (Exception, psycopg2.DatabaseError) as e:
        print(f"Database error: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

# Função para gerar token JWT
def generate_token(user_id):
    payload = {
        'exp': datetime.utcnow() + timedelta(hours=1),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Rota de login
@app.route('/user/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    response = authentication(username, password)
    
    if response:
        user_type, user_id = response
        token = generate_token(user_id)
        session['loggedin'] = True 
        session['id_pessoa'] = user_id
        session['username'] = username
        #session['first_login'] = first_login
        print(session)
        print(f"Sessão iniciada para usuário: {user_id}")
        return jsonify({"message": "Login Successful", 
        "token": token, 
        "type": user_type}), 200
    else:
        return jsonify({"message": "Ops, Something went wrong"}), 500

# Decorator para proteger rotas com token JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            
        if not token:
            return jsonify({'message': "Token is missing"}), 403
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['sub']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/user/protected', methods=['GET'])
@cross_origin()
@token_required
def protected_route(current_user):
    return jsonify({"message": f"Olá {current_user}, Tens acesso a essa página!"})

#bcrypt = Bcrypt(app)
@cross_origin
@app.route('/cadastrar/enviar_sms', methods=['POST'])
def enviar_sms():
    account_sid = 'AC0316bbc155c69201594587251d7a0de8'
    auth_token = '60f0226f50913dbcbec6d6a2fb48c73c'
    remetente = '+14172464949'
    
    dados = request.json
    destinatario = dados.get('destinatario')
    mensagem = dados.get('mensagem')

    client = Client(account_sid, auth_token)

    try:
        message = client.messages.create(
            body=mensagem,
            from_=remetente,
            to=destinatario
        )
        
        response = {'mensagem': 'Olá, estás autorizado a entrar!', 'sid': message.sid}
        status_code = 200
    except Exception as e:
        response = {'mensagem': str(e)}
        status_code = 500
    
    return jsonify(response), status_code, {'Content-Type': 'application/json'}

@app.route('/info/morador', methods=['GET'])
@cross_origin()
@token_required
def user_infomation(current_user):
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute(""" 
    SELECT nome_pessoa, telefone_pessoa, bi_pessoa, email FROM
    pessoa WHERE id_pessoa = %s    
    """, (current_user,))
    morador_data = cursor.fetchone()
    cursor.close()
    if morador_data:
        user_info = {
            'nome': morador_data[0],
            'contacto': morador_data[1],
            'bi': morador_data[2],
            'email': morador_data[3]
        }
        
        return jsonify(user_info), 200
    else:
        return jsonify({'message': 'User not found.'}), 404
      
@app.route('/sair/logout', methods=['POST'])
@cross_origin(supports_credentials=True)
def logout():
    if 'email_usuario' in session:
        session.pop('email_usuario', None)
        return jsonify({'mensagem': 'Deslogou com sucesso!'}), 200 
    else:
        return ({'mensagem': 'Usuário não autenticado!'}), 401   
####### Fim do endpoint de Login ##################

######## Endpoint que lista todas Pessoas ############
@cross_origin
@app.route('/pessoas', methods=["GET"])
def listar_pessoas():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(""" SELECT inic.id_pessoa, 
        inic.nome_pessoa, inic.telefone_pessoa, 
        inic.bi_pessoa, fim.nome_endereco, 
        statu.nome_status FROM pessoa inic INNER JOIN 
        endereco fim ON inic.endereco_id = fim.id_endereco 
        INNER JOIN status statu 
        ON inic.status_id = statu.id_status""")
        results = cursor.fetchall()
        pessoas = []
        for fila in results:
            pessoa = {
        'id_pessoa': fila[0], 
        'nome_pessoa': fila[1], 
        'telefone_pessoa': fila[2], 
        'bi_pessoa': fila[3], 
        'endereco_id': fila[4], 
        'status_id': fila[5]}
            pessoas.append(pessoa)
        cursor.close()
        return jsonify(pessoas)
    
    except Exception as ex:
        print(ex)
        return jsonify({'Mensagem': 'O Browser não conseguiu pegar o Endpoint...'})
######## Fim do Endpoint que lista todas Pessoas ###########


    ######## Endpoint que Cadastra Pessoas ################
@app.route('/pessoas', methods=['POST'])
#print(request.json)
def resgitar_pessoa():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO pessoa (nome_pessoa, telefone_pessoa, endereco_id, status_id, bi_pessoa) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}')".format(request.json['nome_pessoa'],request.json['telefone_pessoa'],request.json['endereco_id'],request.json['status_id'], request.json['bi_pessoa']))
    conn.commit()        
    return jsonify({'Mensagem':'Pessoa cadastrado.'})   
    ######## Fim do Endpoint que Cadastra Pessoas ##########
    
    ######## Endpoint que Atualiza Pessoas ###############
@app.route('/pessoas/put/<int:id_pessoa>', methods=['PUT'])
def atualiza_pessoa(id_pessoa):
    try:
        dados = request.json
        print('Dados recebidos do cliente:', dados)
        
        query = "UPDATE pessoa SET nome_pessoa = %s, telefone_pessoa = %s, endereco_id = %s, status_id = %s, bi_pessoa = %s WHERE id_pessoa = %s"
        valores = (dados['nome_pessoa'], dados['telefone_pessoa'], dados['endereco_id'], dados['status_id'], dados['bi_pessoa'], id_pessoa)
        
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(query, valores)
        conn.commit()
        
        # Seleciona a pessoa atualizada
        cursor.execute("SELECT * FROM pessoa WHERE id_pessoa = %s", (id_pessoa,))
        pessoa_atualizada = cursor.fetchone()
        print('Pessoa atualizada:', pessoa_atualizada)
        
        return jsonify({'Mensagem': 'Pessoa atualizada com sucesso.', 'pessoa': pessoa_atualizada}), 200
    except Exception as e:
        return jsonify({'Erro': str(e)}), 500
    ######## Fim do Endpoint que Atualiza Pessoas ##########
    
@app.route('/endereco', methods=['GET'])
def listar_endereco():
    try:    
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM endereco ORDER BY nome_endereco ASC")    
        results = cursor.fetchall()
        enderecos = []
        for fila in results:
                pessoa = {'id_endereco': fila[0], 'nome_endereco': fila[1], 'bairro_id': fila[2]}
                enderecos.append(pessoa)
        cursor.close()
        return jsonify({'Endereços': enderecos, 'Mensagem': 'Endereço Listadas'})
        
    except Exception as ex:
        print(ex)
        return jsonify({'Mensagem': 'Erro na Sua api'})


######## Endpoint que Cadastra Status ################
@app.route('/cadastrar/status', methods=['POST'])
#print(request.json)
def registar_status():
    nome_status_condo = request.json.get('nome_status_condo')
    if nome_status_condo:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO status_condo (nome_status_condo) VALUES (%s)", (nome_status_condo,)), 200
        conn.commit()        
        return jsonify({'mensagem':'Status cadastrado.'})
    else:
        return jsonify({'mensagem':'Erro: Nome do status não fornecido.'}), 400
    ######## Fim do Endpoint que Cadastra Status ##########
    
############ Endpoint que cadastra Tipo de unidades ###############
cross_origin
@app.route('/cadastrar/tipoUnidades', methods=['POST'])
def registar_tipo_unidades():
   
    nome_tipo_unidade = request.json.get('nome_tipo_unidade')  # Obtém o nome do tipo de condomínio do corpo da requisição JSON
    if nome_tipo_unidade:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO tipounidade (nome_tipo_unidade) VALUES (%s)", (nome_tipo_unidade,))
        conn.commit()
        conn.close()  
        return jsonify({'mensagem': 'Tipo de Unidade cadastrado com sucesso.'}), 200
    else:
        return jsonify({'mensagem': 'Erro: Nome do tipo de unidade não fornecido.'}), 400

########### Fim do Endpoint que cadastra Tipo de unidades ############

@app.route('/cadastrar/morador', methods=['POST'])
@cross_origin()
def cadastrar_morador():
    try:
        # Extrair dados do corpo da requisição JSON
        nome_pessoa = request.json.get('nome_pessoa')
        email = request.json.get('email')
        telefone_pessoa = request.json.get('telefone_pessoa')
        bi_pessoa = request.json.get('bi_pessoa')
        senha_usuario = request.json.get('senha_usuario')  # senha do usuário
        fk_unidade = request.json.get('fk_unidade')  # id da unidade onde o morador vai residir
        fk_tipo_acesso = request.json.get('fk_tipo_acesso')  # id do tipo de acesso do morador
        
        # Verificar se todos os dados necessários foram fornecidos
        if not (nome_pessoa and email and telefone_pessoa and bi_pessoa and senha_usuario and fk_unidade and fk_tipo_acesso):
            return jsonify({'mensagem': 'Erro: Dados incompletos fornecidos.'}), 400
        
        # Inserir dados na tabela pessoa
        conn = psycopg2.connect(
            host="95.216.215.24",
            database="condoflow_db",
            user="postgres",
            password="Angola2023#"
        )
        cursor = conn.cursor()

        cursor.execute(""" 
        SELECT id_morador FROM moradores WHERE fk_unidade = %s;    
        """, (fk_unidade,))
        unidade_ocupada = cursor.fetchone()
        if unidade_ocupada:
            return jsonify({'mensagem': 'Erro: Essa unidade está ocupada.'}), 404
        
        cursor.execute("""
        INSERT INTO pessoa (nome_pessoa, telefone_pessoa, bi_pessoa, email)
        VALUES (%s, %s, %s, %s)
        RETURNING id_pessoa;
        """, (nome_pessoa, telefone_pessoa, bi_pessoa, email))
        
        id_pessoa = cursor.fetchone()[0]
        
        cursor.execute("""
        INSERT INTO usuario (senha_usuario, fk_pessoa)
        VALUES (%s, %s)
        RETURNING id_usuario;
        """, (senha_usuario, id_pessoa))
        
        id_usuario = cursor.fetchone()[0]  # Descomente esta linha se precisar do id_usuario
        
        cursor.execute("""
        INSERT INTO moradores (fk_pessoa, fk_unidade, fk_tipo_acesso)
        VALUES (%s, %s, %s)
        RETURNING id_morador;
        """, (id_pessoa, fk_unidade, fk_tipo_acesso))
        
        id_morador = cursor.fetchone()[0]
        
        conn.commit()
        enviar_email_cadastro_morador(nome_pessoa, email)
        conn.close()
        
        return jsonify({'mensagem': 'Morador cadastrado com sucesso.', 'id_morador': id_morador}), 200
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'}), 500
    
def enviar_email_cadastro_morador(nome_pessoa, email):
    try:
        token = generate_password_reset_token(email)
        frontend_url = 'http://localhost:4200'
        link = f'{frontend_url}/auth/error/{token}'
        msg = Message('Cadastro no sistema', sender='osvaldogui744@gmail.com', recipients=[email])
        html_body = render_template_string(""" 
        <!DOCTYPE html>
            <html>
            <head>
                <title> A sua conta como Morador foi criada com sucesso! </title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #bb162e;
                        color: white;
                        padding: 10px 0;
                        text-align: center;
                        border-radius: 20px;
                    }
                    .content {
                        margin: 20px 0;
                    }
                    .content h2 {
                        color: #bb162e;
                    }
                    .content p {
                        line-height: 1.6;
                    }
                    .footer {
                        text-align: center;
                        color: #777;
                        font-size: 12px;
                        margin-top: 20px;
                    }
                    a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1> Bem-vindo ao Sistema de Condomínios </h1>
                    </div>
                    <div class="content">
                        <h2> Olá, {{ nome_pessoa }}! </h2>
                        <p> Seu cadastro como morador foi realizado com sucesso. </p>
                        <p> <strong> Seu email de acesso é: </strong> {{ email }} </p>
                        <p> Clique <a href="{{ link }}"> aqui </a> para alterar a senha e acessar ao sistema. </p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Sistema de gestão de Condomínios. Todos os direitos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
        """, link=link, nome_pessoa=nome_pessoa, email=email)
        msg.html = html_body
        mail.send(msg)
        print('E-mail enviado com sucesso.')
    except Exception as e:
        print(f'Falha ao enviar e-mail: {e}')

#########  Lista todos moradores ###########

@app.route('/lista/moradores', methods=['GET'])
@cross_origin()
def listar_morador():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    cursor.execute(''' 
    SELECT 
    m.id_morador,
    p.id_pessoa,
    p.nome_pessoa,
    p.telefone_pessoa,
    p.bi_pessoa,
    p.email,
    un.metragem_unidade as nome_unidade
    FROM 
    pessoa p
    INNER JOIN 
    usuario u ON p.id_pessoa = u.fk_pessoa
    INNER JOIN 
    moradores m ON p.id_pessoa = m.fk_pessoa
    INNER JOIN
    unidade un ON m.fk_unidade = un.id_unidade
    ''')
    results = cursor.fetchall()
    
    moradores_list = []
    for row in results:
        moradores_list.append({
    'id_morador': row[0],
    'id_pessoa': row[1],
    'nome_pessoa': row[2],
    'telefone_pessoa': row[3],
    'bi_pessoa': row[4],
    'email': row[5],
    'nome_unidade': row[6] 
    })

    cursor.close()
    conn.close()

    return jsonify(moradores_list)


############################### Fim da listagem dos moradores ############


##################### Cadastra Tipo de estacionamento ##############
cross_origin
@app.route('/cadastrar/tipoEstacionamento', methods=['POST'])
def registar_tipo_estacionamento():
   
    nome_tipo_estacionamento = request.json.get('nome_tipo_estacionamento')  # Obtém o nome do tipo de condomínio do corpo da requisição JSON
    if nome_tipo_estacionamento:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO tipoestacionamento (nome_tipo_estacionamento) VALUES (%s)", (nome_tipo_estacionamento,))
        conn.commit()
        conn.close()  
        return jsonify({'mensagem': 'Tipo de Estacionamento cadastrado com sucesso.'}), 200
    else:
        return jsonify({'mensagem': 'Erro: Nome do tipo de Estacionamento não fornecido.'}), 400
##################### Fim de cadastrameneto do tipo de estacionamento #########

@app.route('/status', methods=['GET'])
def listar_status():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM status ORDER BY nome_status ASC")    
        results = cursor.fetchall()
        status = []
        for fila in results:
                pessoa = {'id_status': fila[0], 'nome_status': fila[1]}
                status.append(pessoa)
        cursor.close()
        return jsonify({'Estados': status, 'Mensagem': 'Estados Listadas'})
        
    except Exception as ex:
        print(ex)
        return jsonify({'Mensagem': 'Erro na Sua api'})

    ####### Endpoint que Elimina Pessoas #######
@app.route('/pessoas/delete/<int:id_pessoa>', methods=['DELETE'])
def eliminar_pessoa(id_pessoa):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM pessoa WHERE id_pessoa = %s", (id_pessoa,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({'erro': 'Pessoa com o ID {} não encontrada'.format(id_pessoa)}), 404
        else:
            return jsonify({'mensagem': 'Pessoa eliminada com sucesso'}), 200
    except Exception as e:
        return jsonify({'erro': 'Ocorreu um erro ao excluir a pessoa: {}'.format(str(e))}), 500

    ####### Fim do Endpoint que elimina Pessoas

######### Endpoint que pega Pessoas por id ##########
@app.route('/pessoas/edit/<int:id_pessoa>', methods=['GET'])
def pessoa_por_id(id_pessoa):
    
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pessoa WHERE id_pessoa = %s", (id_pessoa,))
    results = cursor.fetchone()
    pessoa = None
    if results != None:
     pessoa = {
         'id_pessoa':results[0], 
         'nome_pessoa':results[1], 
         'telefone_pessoa':results[2], 
         'endereco_id':results[3], 
         'status_id':results[4], 
         'bi_pessoa':results[5],
         }  
    cursor.close()
    if pessoa: 
        return jsonify({'Pessoa':pessoa, 'Mensagem':'Pessoa encontrada'}), 200
    else:
     return jsonify({'message': 'Pessoa não encontrado'}), 404

####### Endpoint que lista todos condomínios ##########

@app.route('/lista/condominios', methods=['GET'])
@cross_origin()
def listar_condominios():
    try:
       conn = db.engine.raw_connection()
       cursor = conn.cursor()
       cursor.execute(""" 
  
    SELECT 
    condo.id_condominio,
    condo.nome_condominio,
    tipo.nome_tipo_condominio,
    sindico.nome_sindico,
    morada.nome_endereco
    FROM 
    condominio condo
    INNER JOIN 
    tipocondominio tipo ON condo.tipo_condominio_id = tipo.id_tipo_condominio
    INNER JOIN 
    endereco morada ON condo.endereco_id = morada.id_endereco
    INNER JOIN 
    sindico ON condo.sindico_id = sindico.id_sindico
    """)
       results = cursor.fetchall()
       condominios=[]
       for fila in results:
         condominio={
        'id_condominio':fila[0], 
        'nome_condominio':fila[1], 
        'nome_tipo_condominio':fila[2], 
        'nome_sindico':fila[3], 
        'nome_endereco':fila[4],
        }  
         condominios.append(condominio)
       cursor.close()
       return jsonify({'condominios':condominios, 'Mensagem': 'Condomínios Listados'})
    except Exception as ex:
        print(ex) 
        return jsonify({'mensagem':'Erro na sua api'})
    ########### Fim do Endpoint que lista todos condomínios ##########
    
@cross_origin()   
@app.route('/lista/tipoDespesas', methods=['GET'])
def listar_despesas():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tipo_despesa")
        results = cursor.fetchall()
        tipos = []
        for fila in results:
            despesaTipo = {
                'id_despesa': fila[0],
                'nome_despesa': fila[1],
                'valor_despesa': fila[2]
            }
            tipos.append(despesaTipo)
        cursor.close()
        return jsonify({'tipos': tipos, 'Mensagem': 'tipos de despesas'})
    except Exception as ex:
        print(ex)
        return jsonify({'Mensagem': 'Erro na sua API'}), 500
    ########### Fim do Endpoint que lista todos condomínios ##########

   ####### Endpoint que lista condomínio por ID #########
@app.route('/condominios/<id_condominio>', methods=['GET'])
def condominios_by_id(id_condominio):

    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM condominio WHERE id_condominio = '{0}'".format(id_condominio))
    results = cursor.fetchone()
    if results != None:
     condominio={'id_condominio':results[0], 'nome_condominio':results[1], 'tipo_condominio_id':results[2], 'sindico_id':results[3], 'endereco_id':results[4]}  
    cursor.close()
    return jsonify({'Condominio':condominio, 'Mensagem':'Condominio encontrado'})  
    ####### Fim do Endpoint que lista por ID ################## 
   
######## Endpoint que Cadastra Pessoas ################
@app.route('/pessoas', methods=['POST'])
def cadastrar_pessoa():
    data = request.json

    # Insere a pessoa na tabela pessoa
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO pessoa (nome_pessoa, telefone_pessoa, endereco_id, status_id, bi_pessoa) VALUES (%s, %s, %s, %s, %s)",
    (data['nome_pessoa'], data['telefone_pessoa'], data['endereco_id'], data['status_id'], data['bi_pessoa']))
    conn.commit()

    # Obtém o ID da pessoa recém-cadastrada
    #cursor.execute("SELECT LAST_INSERT_ID()")
    #pessoa_id = cursor.fetchone()[0]

    # Insere um morador relacionado à pessoa na tabela morador
    #cursor.execute("INSERT INTO morador (pessoa_id) VALUES (%s)", (pessoa_id,))
   # conn.commit()

    # Fecha a conexão com o banco de dados
   # cursor.close()
   # conn.close()

    return jsonify({'mensagem': 'Pessoa cadastrada com sucesso.'})
######## Fim do Endpoint que Cadastra Pessoas ##########
#*/   
   
   
    ######## Endpoint que Cadastra Condomínio ################
@app.route('/cadastrar/condominios', methods=['POST'])
#print(request.json)
def resgitar_condominio():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("""INSERT INTO condominio 
    (nome_condominio, tipo_condominio_id, 
    sindico_id, endereco_id) VALUES 
    ('{0}', '{1}', '{2}', '{3}')"""
    .format(request.json['nome_condominio'],
    request.json['tipo_condominio_id'],
    request.json['sindico_id'],
    request.json['endereco_id']))
    conn.commit()        
    return jsonify({'mensagem':'Condomínio cadastrado.'})   
    ######## Fim do Endpoint que Cadastra Condomínio ##########

################# Endpoint que cadastra Bloco ############    
@app.route('/cadastrar/bloco', methods=['POST'])
def registar_bloco():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute(""" INSERT INTO bloco
    (nome_bloco , condominio_id) VALUES 
    ('{0}', '{1}')               
    """.format(request.json['nome_bloco'],
    request.json['condominio_id']))
    conn.commit()
    return jsonify({'mensagem': 'Bloco cadastrado com sucesso.'})
################## Fim do cadastro Bloco ####################### 
   
################# Endpoint que cadastra Tipo de Despesas ############    
@app.route('/cadastrar/tipoDespesa', methods=['POST'])
def registar_tipoDespesa():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute(""" INSERT INTO tipo_despesa
    (nome_tipo_despesa , tipo_valor_despesa) VALUES 
    ('{0}', '{1}')               
    """.format(request.json['nome_tipo_despesa'],
    request.json['tipo_valor_despesa']))
    conn.commit()
    return jsonify({'mensagem': 'Tipo de despesa cadastrado com sucesso.'})
################## Fim do cadastro Tipo de despesas #######################  

################ Cadastrar Despesas ###################

UPLOAD_FOLDER = '/home/netag/Documentos/PROJECTS/Condoflow/backAPI/src/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def create_directory_if_not_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

create_directory_if_not_exists(UPLOAD_FOLDER)

def connect_to_database():
    try:
        conn = psycopg2.connect(
            dbname="condoflow_db",
            user="postgres",
            password="Angola2023#",
            host="95.216.215.24"
        )
        return conn
    except Exception as e:
        traceback.print_exc()
        raise e

def cadastrar_despesas(despesa_id, valor_despesa, morador_id, filename, unidade_id, mes_despesa):
    conn = connect_to_database()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO despesas (despesa_id, valor_despesa, morador_id, comprovativo_despesa, unidade_id, mes_despesa)  
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (despesa_id, valor_despesa, morador_id, filename, unidade_id, mes_despesa))
        conn.commit()
        return True
    except Exception as e:
        traceback.print_exc()
        return False
    finally:
        cursor.close()
        conn.close()

@app.route('/cadastrar/despesas', methods=["POST"])
def cadastrar_despesa():
    try:
        if 'comprovativo_despesa' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        comprovativo_despesa = request.files['comprovativo_despesa']
        
        if comprovativo_despesa.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        filename = secure_filename(comprovativo_despesa.filename)
        dst = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        comprovativo_despesa.save(dst)
        
        despesa_id = request.form.get('despesa_id')
        valor_despesa = request.form.get('valor_despesa')
        morador_id = request.form.get('morador_id')
        unidade_id = request.form.get('unidade_id')
        mes_despesa = request.form.get('mes_despesa')

        try:
            mes_despesa = datetime.strptime(mes_despesa, '%a %b %d %Y %H:%M:%S GMT%z (Horário Padrão da África Ocidental)')
            mes_despesa = mes_despesa.strftime('%Y-%m-%d %H:%M:%S')
        except ValueError as e:
            traceback.print_exc()
            return jsonify({'error': 'Formato de data inválido. Use o formato Tue Jul 23 2024 00:00:00 GMT+0100 (Horário Padrão da África Ocidental)'}), 400
        
        if not all([despesa_id, valor_despesa, morador_id, unidade_id, mes_despesa]):
            return jsonify({'error': 'Todos os campos devem ser preenchidos.'}), 400
        
        if cadastrar_despesas(despesa_id, valor_despesa, morador_id, filename, unidade_id, mes_despesa):
            return jsonify({'mensagem': 'Despesa cadastrada com sucesso.'}), 200
        else:
            return jsonify({'error': 'Erro ao cadastrar a despesa.'}), 500

    except Exception as e:
        print(e)
        traceback.print_exc()
        return jsonify({'error': 'Erro interno ao processar a requisição.'}), 500

@app.route('/uploads/<path:filename>', methods=["GET"])
def serve_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
################ FIM DESPESAS ########################


####### Endpoint que lista todos Blocos ##########

@app.route('/lista/despesa_moradores', methods=['GET'])
@cross_origin()
@token_required
def listar_despes(current_user):
    try:
       conn = db.engine.raw_connection()
       cursor = conn.cursor()
       cursor.execute("""
SELECT 
despesas.id_despesa,
pessoa.nome_pessoa AS nome_morador,
pessoa.email AS email_morador,
pessoa.telefone_pessoa AS telefone_morador,
tipo_despesa.nome_tipo_despesa,
despesas.valor_despesa,
despesas.comprovativo_despesa,
despesas.mes_despesa,
despesas.estado,
unidade.metragem_unidade AS nome_unidade,
bloco.nome_bloco AS nome_bloco
FROM
despesas
INNER JOIN 
tipo_despesa ON despesas.despesa_id = tipo_despesa.id_tipo_despesa
INNER JOIN
moradores ON despesas.morador_id = moradores.id_morador
INNER JOIN
pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
INNER JOIN 
unidade ON moradores.fk_unidade = unidade.id_unidade
INNER JOIN 
bloco ON unidade.bloco_id = bloco.id_bloco
WHERE 
moradores.fk_pessoa = %s;

""", (current_user,))
       results = cursor.fetchall()
       despesas=[]
       for fila in results:
         despesa={
        'id_despesa':fila[0], 
        'nome_morador':fila[1], 
        'email_morador':fila[2], 
        'telefone_morador':fila[3], 
        'nome_tipo_despesa':fila[4], 
        'valor_despesa':fila[5], 
        'comprovativo_despesa':fila[6],
        'mes_despesa': fila[7],
        'estado':fila[8],
        'nome_unidade': fila[9],
        'nome_bloco': fila[10]}  
         despesas.append(despesa)
       cursor.close()
       return jsonify({'despesas':despesas, 'mensagem': 'Despesas listado.'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem':'Erro na sua api'})
########### Fim do Endpoint que lista todos Blocos ##########    
  
#@app.route('/admin/lista/despesas')   

@app.route('/admin/lista/despesa_moradores', methods=['GET'])
@cross_origin()
@token_required
def listar_admin(current_user):
    try:
       conn = db.engine.raw_connection()
       cursor = conn.cursor()
       cursor.execute("""
SELECT 
despesas.id_despesa,
pessoa.nome_pessoa AS nome_morador,
pessoa.email AS email_morador,
pessoa.telefone_pessoa AS telefone_morador,
tipo_despesa.nome_tipo_despesa,
despesas.valor_despesa,
despesas.comprovativo_despesa,
despesas.mes_despesa,
despesas.estado,
unidade.metragem_unidade AS nome_unidade,
bloco.nome_bloco AS nome_bloco
FROM
despesas
INNER JOIN 
tipo_despesa ON despesas.despesa_id = tipo_despesa.id_tipo_despesa
INNER JOIN
moradores ON despesas.morador_id = moradores.id_morador
INNER JOIN
pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
INNER JOIN 
unidade ON moradores.fk_unidade = unidade.id_unidade
INNER JOIN 
bloco ON unidade.bloco_id = bloco.id_bloco

""", (current_user,))
       results = cursor.fetchall()
       despesas=[]
       for fila in results:
         despesa={
        'id_despesa':fila[0], 
        'nome_morador':fila[1], 
        'email_morador':fila[2], 
        'telefone_morador':fila[3], 
        'nome_tipo_despesa':fila[4], 
        'valor_despesa':fila[5], 
        'comprovativo_despesa':fila[6],
        'mes_despesa': fila[7],
        'estado':fila[8],
        'nome_unidade': fila[9],
        'nome_bloco': fila[10]}  
         despesas.append(despesa)
       cursor.close()
       return jsonify({'despesas':despesas, 'mensagem': 'Despesas listado.'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem':'Erro na sua api'})

   
####### Endpoint que lista todos Blocos ##########
@cross_origin
@app.route('/lista/blocos', methods=['GET'])
def listar_blocos():
    try:
       conn = db.engine.raw_connection()
       cursor = conn.cursor()
       cursor.execute("""
SELECT 
    bloco.id_bloco,
    bloco.nome_bloco,
    condominio.nome_condominio,
    tipocondominio.nome_tipo_condominio,
    condominio.sindico_id,
    endereco.id_endereco,
    endereco.nome_endereco
FROM 
    bloco
JOIN 
    condominio ON bloco.condominio_id = condominio.id_condominio
JOIN 
    endereco ON condominio.endereco_id = endereco.id_endereco
JOIN 
    tipocondominio ON condominio.tipo_condominio_id = tipocondominio.id_tipo_condominio   
""")
       results = cursor.fetchall()
       blocos=[]
       for fila in results:
         bloco={
        'id_bloco':fila[0], 
        'nome_bloco':fila[1], 
        'nome_condominio':fila[2], 
        'nome_tipo_condominio':fila[3], 
        'sindico_id':fila[4], 
        'nome_endereco':fila[6]}  
         blocos.append(bloco)
       cursor.close()
       return jsonify({'blocos':blocos, 'mensagem': 'Blocos Listados'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem':'Erro na sua api'})
    ########### Fim do Endpoint que lista todos Blocos ##########    
    
@app.route('/lista/tipoReservas', methods=['GET'])
@cross_origin()
def listar_tipo_reservas():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT 
            id_tipo_reserva,
            nome_tipo_reserva
        FROM 
            tipo_reserva
        """)
        results = cursor.fetchall()
        tipo_reservas = []
        for fila in results:
            tipo_reserva = {
                'id_tipo_reserva': fila[0], 
                'nome_tipo_reserva': fila[1]
            }
            tipo_reservas.append(tipo_reserva)
        cursor.close()
        return jsonify({'tipo_reservas': tipo_reservas, 'mensagem': 'Tipos de Reservas Listados'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem':'Erro na sua API'})

 ################# Endpoint que cadastra Unidade ############    
@app.route('/cadastrar/unidade', methods=['POST'])
def registar_uni():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(""" INSERT INTO unidade
        (numero_quarto_unidade , metragem_unidade, 
        tipo_unidade_id, bloco_id) VALUES 
        ('{0}', '{1}', '{2}', '{3}')               
        """.format(request.json['numero_quarto_unidade'],
        request.json['metragem_unidade'], 
        request.json['tipo_unidade_id'], 
        request.json['bloco_id']))
        conn.commit()
        return jsonify({'mensagem': 'Unidade cadastrado com sucesso.'})
    except psycopg2.errors.InvalidTextRepresentation as e:
        mensagem_erro = 'Número inválido!'
        return jsonify({'erro': mensagem_erro}), 400
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500
################## Fim do cadastro Unidade #######################    
    
    
     ################# Endpoint que cadastra Unidade ############    
@app.route('/cadastrar/estacionamento', methods=['POST'])
def registar_estacionamento():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(""" INSERT INTO estacionamento
        (serie_estacionamento ,unidade_id, 
        bloco_id, tipo_estacionamento_id, status_condo_id) VALUES 
        ('{0}', '{1}', '{2}', '{3}', '{4}')               
        """.format(request.json['serie_estacionamento'],
        request.json['unidade_id'], 
        request.json['bloco_id'], 
        request.json['tipo_estacionamento_id'],
        request.json['status_condo_id']
        ))
        conn.commit()
        return jsonify({'mensagem': 'Estacionamento cadastrado com sucesso.'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500
################## Fim do cadastro Unidade ####################### 
    
    
@cross_origin
@app.route('/lista/estacionamento', methods=['GET'])
def listar_estacionamentos():
    try:
       conn = db.engine.raw_connection()
       cursor = conn.cursor()
       cursor.execute(""" 
        SELECT 
    estacionamento.id_estacionamento,
	estacionamento.serie_estacionamento, 
    unidade.metragem_unidade,   
    bloco.nome_bloco,    
    tipoestacionamento.nome_tipo_estacionamento,    
    status_condo.nome_status_condo
FROM 
    estacionamento
INNER JOIN 
    unidade ON estacionamento.unidade_id = unidade.id_unidade
INNER JOIN 
    bloco ON unidade.bloco_id = bloco.id_bloco
INNER JOIN 
    tipoestacionamento ON estacionamento.tipo_estacionamento_id = tipoestacionamento.id_tipo_estacionamento
INNER JOIN 
    status_condo ON estacionamento.status_condo_id = status_condo.id_status_condo;

""")
       results = cursor.fetchall()
       estacionamentos = []
       for fila in results:
           estacionamento = {
            'id_estacionamento': fila[0],
            'serie_estacionamento': fila[1],
            'metragem_unidade': fila[2],
            'nome_bloco': fila[3],
            'nome_tipo_estacionamento': fila[4],
            'nome_status_condo': fila[5], 
           }
           estacionamentos.append(estacionamento)
       cursor.close()
       return jsonify(estacionamentos)
    except Exception as ex:
        print(ex)
        return jsonify({'Mensagem': 'Erro na sua api'})
    
    
    ######## Endpoint que Atualiza Condomínio ###############
@app.route('/condominios/<id_condominio>', methods=['PUT'])
def atualiza_condominio(id_condominio):
   conn = db.engine.raw_connection()
   cursor = conn.cursor()
   cursor.execute("UPDATE condominio SET nome_condominio = '{0}',tipo_condominio_id = '{1}', sindico_id = '{2}', endereco_id = '{3}' WHERE id_condominio = '{4}'".format(request.json['nome_condominio'], request.json['tipo_condominio_id'], request.json['sindico_id'], request.json['endereco_id'], id_condominio))
   conn.commit()
   return jsonify({'Mensagem':'Condomínio atualizado com sucesso.'})


    ######## Fim do Endpoint que Atualiza Condomínio ##########


############ Endpoint que cadastra tipo de condomínio #############
@app.route('/cadastrar/tipoCondominio', methods=['POST'])
def registar_tipoCondominio():
    nome_tipo_condominio = request.json.get('nome_tipo_condominio')  # Obtém o nome do tipo de condomínio do corpo da requisição JSON
    if nome_tipo_condominio:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO tipocondominio (nome_tipo_condominio) VALUES (%s)", (nome_tipo_condominio,))
        conn.commit()
        conn.close()  
        return jsonify({'mensagem': 'Tipo de condomínio cadastrado com sucesso.'}), 200
    else:
        return jsonify({'mensagem': 'Erro: Nome do tipo de condomínio não fornecido.'}), 400
########### Fim do Endpoint que cadastra tipo de condomínio ##################        
    


    ####### Endpoint que Elimina Condomínio ##############
@app.route('/condominios/<id_condominio>', methods=['DELETE'])
def eliminar_condominio(id_condominio):
   conn = db.engine.raw_connection()
   cursor = conn.cursor()
   cursor.execute("DELETE FROM condominio WHERE id_condominio = '{0}'".format(id_condominio))
   conn.commit()
   return jsonify({'Mensagem':'Condomínio Eliminado com Sucesso.'})

    ####### Fim do Endpoint que elimina Condomínio
    
####### Endpoint que lista todos Síndicos ##########
@cross_origin
@app.route('/sindicos', methods=['GET'])
def listar_sindicos():
    try:
       conn = db.engine.raw_connection()
       cursor = conn.cursor()
       cursor.execute("SELECT inic.id_sindico , fim.nome_pessoa FROM sindico inic INNER JOIN pessoa fim ON inic.pessoa_id = fim.id_pessoa")
       results = cursor.fetchall()
       sindicos=[]
       for fila in results:
         sindico={'id_sindico':fila[0], 'pessoa_id':fila[1]}  
         sindicos.append(sindico)
       cursor.close()
       return jsonify({'Sindicos':sindicos, 'Mensagem': 'Síndicos Listados'})
    except Exception as ex:
        return jsonify({'Mensagem':'Erro na sua api'})
    ########### Fim do Endpoint que lista todos Síndicos ##########3

      ####### Endpoint que lista todos condomínios ##########
@cross_origin
@app.route('/lista/tipocondominio', methods=['GET'])
def listar_tipocondominios():
    try:
       conn = db.engine.raw_connection()
       cursor = conn.cursor()
       cursor.execute("SELECT * FROM tipocondominio ORDER BY nome_tipo_condominio")
       results = cursor.fetchall()
       tipoCondominios = []
       for fila in results:
           tipoCondominio = {
            'id_tipo_condominio': fila[0],
            'nome_tipo_condominio': fila[1]
           }
           tipoCondominios.append(tipoCondominio)
       cursor.close()
       return jsonify(tipoCondominios)
    except Exception as ex:
        print(ex)
        return jsonify({'Mensagem': 'Erro na sua api'})

########### Fim do Endpoint que lista todos condomínios ##########3

      ####### Endpoint que lista todos condomínios ##########
@cross_origin
@app.route('/lista/tipoManutencao', methods=['GET'])
def listar_Tipomanutencao():
    try:
       conn = db.engine.raw_connection()
       cursor = conn.cursor()
       cursor.execute("SELECT * FROM tipo_manutencao ORDER BY id_tipo_manutencao")
       results = cursor.fetchall()
       tipoManutencao = []
       for fila in results:
           tipomanu = {
            'id_tipo_manutencao': fila[0],
            'descricao_manutencao': fila[1]
           }
           tipoManutencao.append(tipomanu)
       cursor.close()
       return jsonify(tipoManutencao)
    except Exception as ex:
        print(ex)
        return jsonify({'Mensagem': 'Erro na sua api'})

    ########### Fim do Endpoint que lista todos condomínios ##########3
    
    

################ Lista todos tipos de Unidades
@cross_origin
@app.route('/lista/tipoUnidades', methods=['GET'])
def lista_tipo_unidades():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tipounidade")
        results = cursor.fetchall()
        tipo_unidades = []
        for fila in results:
            tipo_unidade = {
                'id_tipo_unidade': fila[0],
                'nome_tipo_unidade': fila[1]
            }
            tipo_unidades.append(tipo_unidade)
        cursor.close()
        return jsonify(tipo_unidades)
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'})

########################## Fim da listagem ####################

@cross_origin
@app.route('/lista/status_condo', methods=['GET'])
def listar_status_condo():
    try:
       conn = db.engine.raw_connection()
       cursor = conn.cursor()
       cursor.execute("SELECT * FROM status_condo")
       results = cursor.fetchall()
       status_condo = []
       for fila in results:
           status = {
               'id_status_condo': fila[0],
               'nome_status_condo': fila[1]
           }
           status_condo.append(status)
       cursor.close()
       return jsonify(status_condo)
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua api'})

################ Lista todos tipos de Unidades ############
@cross_origin
@app.route('/lista/tipoEstacionamento', methods=['GET'])
def lista_tipo_estacionamento():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tipoestacionamento")
        results = cursor.fetchall()
        tipo_estacionamentos = []
        for fila in results:
            tipo_estacionamento = {
                'id_tipo_estacionamento': fila[0],
                'nome_tipo_estacionamento': fila[1]
            }
            tipo_estacionamentos.append(tipo_estacionamento)
        cursor.close()
        return jsonify(tipo_estacionamentos)
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'})
########################## Fim da listagem ####################

@app.route('/cadastrar/porteiro', methods=['POST'])
def cadastrar_novo_porteiro():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()

        nome_porteiro = request.json['nome_porteiro']
        telefone_porteiro = request.json['telefone_porteiro']
        bi_porteiro = request.json['bi_porteiro']
        email_porteiro = request.json['email_porteiro']
        senha_porteiro = request.json['senha_porteiro']

        cursor.execute("SELECT * FROM porteiro WHERE email_porteiro = %s", (email_porteiro,))
        existing_porteiro = cursor.fetchone()

        if existing_porteiro:
            cursor.execute("""
                UPDATE porteiro SET nome_porteiro = %s, telefone_porteiro = %s, bi_porteiro = %s,
                senha_porteiro = %s WHERE email_porteiro = %s
            """, (nome_porteiro, telefone_porteiro, bi_porteiro, senha_porteiro, email_porteiro))
        else:
            cursor.execute("""
                INSERT INTO porteiro (nome_porteiro, telefone_porteiro, bi_porteiro, email_porteiro, senha_porteiro)
                VALUES (%s, %s, %s, %s, %s)
            """, (nome_porteiro, telefone_porteiro, bi_porteiro, email_porteiro, senha_porteiro))

        conn.commit()

        enviar_email_cadastro_porteiro(nome_porteiro, email_porteiro)

        return jsonify({'mensagem': 'Porteiro cadastrado/atualizado com sucesso.'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500

def enviar_email_cadastro_porteiro(nome_porteiro, email_porteiro):
    try:
        token = generate_password_reset_token(email_porteiro)
        frontend_url = 'http://localhost:4200'  # Substitua pelo URL correto do seu frontend
        
        link = f'{frontend_url}/auth/access/{token}'
        msg = Message('Cadastro no Sistema', sender='osvaldogui744@gmail.com', recipients=[email_porteiro])

        html_body = render_template_string("""
           <!DOCTYPE html>
            <html>
            <head>
                <title> A sua conta como Porteiro foi criada com sucesso! </title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #bb162e;
                        color: white;
                        padding: 10px 0;
                        text-align: center;
                        border-radius: 20px;
                    }
                    .content {
                        margin: 20px 0;
                    }
                    .content h2 {
                        color: #bb162e;
                    }
                    .content p {
                        line-height: 1.6;
                    }
                    .footer {
                        text-align: center;
                        color: #777;
                        font-size: 12px;
                        margin-top: 20px;
                    }
                    a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1> Bem-vindo ao Sistema de Condomínios </h1>
                    </div>
                    <div class="content">
                        <h2> Olá, {{ nome_porteiro }}! </h2>
                        <p> Seu cadastro como porteiro foi realizado com sucesso.</p>
                        <p> <strong> Seu email de acesso é: </strong> {{ email_porteiro }} </p>
                        <p> Clique <a href="{{ link }}"> aqui </a> para alterar a senha e acessar ao sistema.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Sistema de gestão de Condomínios. Todos os direitos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
        """, link=link, nome_porteiro=nome_porteiro, email_porteiro=email_porteiro)

        msg.html = html_body
        mail.send(msg)
    except Exception as e:
        print(f'Falha ao enviar e-mail: {e}')

def generate_password_reset_token(email):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='password-reset-salt')

###################### Alterar a senha do porteiro ##############

from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

@app.route('/alterar_senha', methods=['POST'])
def alterar_senha():
    try:
        token = request.json.get('token')
        senha_porteiro = request.json.get('senha_porteiro')  # Nome do campo alterado para 'senha'

        serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

        try:
            email_porteiro = serializer.loads(token, salt='password-reset-salt', max_age=3600)  # Token válido por 1 hora
        except (SignatureExpired, BadSignature) as e:
            return jsonify({'erro': 'Token inválido ou expirado.'}), 400

        conn = db.engine.raw_connection()
        cursor = conn.cursor()

        # Atualiza a senha do porteiro
        cursor.execute("""
            UPDATE porteiro SET senha_porteiro = %s WHERE email_porteiro = %s
        """, (senha_porteiro, email_porteiro))

        conn.commit()

        return jsonify({'mensagem': 'Senha alterada com sucesso.'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500

#################### Fim da alteração da senha do porteiro ############

@app.route('/api/check_first_login/<int:fk_pessoa>', methods=['GET'])
def check_first_login(fk_pessoa):
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""SELECT first_login FROM moradores WHERE fk_pessoa = %s""", (fk_pessoa,))
        result = cursor.fetchone()
        if result and result[0]: 
            cursor.execute("""UPDATE moradores SET first_login = FALSE WHERE fk_pessoa = %s""", (fk_pessoa,))
            conn.commit()
            return jsonify({'first_login': True})
        return jsonify({'first_login': False})
    except (Exception, psycopg2.DatabaseError) as e:
        print(f"Database error: {e}")
        return jsonify({'error': str(e)})
    finally:
        cursor.close()
        conn.close()


######## Endpoint que Cadastra Morador ################
@cross_origin
@app.route('/cadastrar/moradores', methods=['POST'])
def registar_morador():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        
        nome_morador = request.json['nome_morador']
        email_morador = request.json['email_morador']
        telefone_morador = request.json['telefone_morador']
        unidade_id = request.json['unidade_id']
        senha_morador = generate_password_hash(request.json['senha_morador'])

        cursor.execute("""
            INSERT INTO moradores (nome_morador, email_morador, telefone_morador, unidade_id, senha_morador) 
            VALUES (%s, %s, %s, %s, %s)
        """, (nome_morador, email_morador, telefone_morador, unidade_id, senha_morador))
        
        conn.commit()

        # Enviar e-mail para o usuário
        enviar_email_alteracao_senha(email_morador)

        return jsonify({'mensagem': 'Morador cadastrado com sucesso.'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500

def enviar_email_alteracao_senha(email_morador):
    try:
        token = generate_password_reset_token(email_morador)  # Função para gerar um token de redefinição de senha
        link = url_for('reset_password', token=token, _external=True)
        msg = Message('Olá', sender='osvaldogui744@gmail.com', recipients=[email_morador])
        
        html_body = render_template_string("""
            <!DOCTYPE html>
            <html>
            <head>
                <title> Altere a sua senha: </title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        border-radius: 10px;
                        padding: 40px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .logo {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .logo img {
                        width: 150px;
                    }
                    .content {
                        margin-bottom: 30px;
                    }
                    .button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">
                         <img src="https://github.com/netag-dev/Condoflow/blob/master/frontend/sakai-ng/src/assets/demo/images/login/8.png" alt="Image" height="70" class="mb-1">
                    </div>
                    <div class="content">
                        <p> Olá </p>
                        <p>Por favor, clique no botão abaixo para alterar sua senha.</p>
                        <a href="{{ link }}" style="text-transform:uppercase;color:white;" class="button"> Alterar Senha </a>
                    </div>
                </div>
            </body>
            </html>
        """, link=link) 
        
        msg.html = html_body 
        mail.send(msg)
    except Exception as e:
        print(f'Falha ao enviar e-mail: {e}')

def generate_password_reset_token(email):
    # Aqui você deve implementar a geração do token e o armazenamento dele de forma segura
    # Você pode usar uma biblioteca como itsdangerous para gerar tokens seguros
    from itsdangerous import URLSafeTimedSerializer
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='password-reset-salt')


@app.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=3600)
    except SignatureExpired:
        return jsonify({'erro': 'O link para alteração de senha expirou.'}), 400
    except BadSignature:
        return jsonify({'erro': 'Token inválido.'}), 400

    if request.method == 'POST': 
        nova_senha = request.json['nova_senha']
        nova_senha_hash = generate_password_hash(nova_senha)

        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE moradores SET senha_morador = %s WHERE email_morador = %s
        """, (nova_senha_hash, email))
        conn.commit()

        return jsonify({'mensagem': 'Senha alterada com sucesso.'}), 200

    return '''
    <form method="post">
        Nova Senha: <input type="password" name="nova_senha">
        <input type="submit" value="Alterar Senha">
    </form>
    '''
######## Fim do Endpoint que Cadastra Pessoas ##########

@app.route('/alterar_senha_morador', methods=['POST'])
def alterar_senha_morador():
    try:
        token = request.json.get('token')
        senha_morador = request.json.get('senha_morador')  # Nome do campo alterado para 'senha'

        serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

        try:
            email = serializer.loads(token, salt='password-reset-salt', max_age=3600)  # Token válido por 1 hora
        except (SignatureExpired, BadSignature) as e:
            return jsonify({'erro': 'Token inválido ou expirado.'}), 400

        conn = db.engine.raw_connection()
        cursor = conn.cursor()

        # Atualiza a senha do morador
        cursor.execute("""
            UPDATE usuario AS u
            SET senha_usuario = %s
            WHERE u.id = (
            SELECT u.id FROM usuário AS u
            JOIN moradores AS m ON u.id_morador = m.id
            JOIN pessoa AS p ON m.id_pessoa = p.id
            WHERE p.email = %s)""", (senha_morador, email))

        conn.commit()

        return jsonify({'mensagem': 'Senha alterada com sucesso.'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500

#################### listagem de moradores #####################


#@app.route('/lista/moradores', methods=['GET'])
#@cross_origin()
#@token_required
#def get_moradores(current_user):
#    conn = db.engine.raw_connection()
#    cursor = conn.cursor()
    # Supondo que você tenha um objeto db representando sua conexão com o banco de dados
#    cursor.execute('''
#    SELECT 
#    m.id_morador,
#    p.id_pessoa,
#    p.nome_pessoa,
#    p.telefone_pessoa,
 #   p.email,
 #   p.bi_pessoa,
 #   u.metragem_unidade,
 #   u.bloco_id,
 #   u.numero_quarto_unidade,
 #   u.tipo_unidade_id
 #   FROM 
 #   moradores m
  #  INNER JOIN 
   # pessoa p ON m.fk_pessoa = p.id_pessoa
    #INNER JOIN 
  #  unidade u ON m.fk_unidade = u.id_unidade WHERE m.fk_pessoa = %s
  #  ''', (current_user,))
  #  results = cursor.fetchall()
  #  moradores_list = []
  #  for row in results:
  #      moradores_list.append({
   #         'id_morador': row[0],
   #         'nome_pessoa': row[2],
   #         'telefone_pessoa': row[3],
   #         'email': row[4],
   #         'bi_pessoa': row[5],
   #         'metragem_unidade': row[6],
   #         'bloco_id': row[7],
   #         'numero_quarto_unidade': row[8],
   #         'tipo_unidade_id': row[9]
   #     })
   #     cursor.close()
   # return jsonify(moradores_list)

@app.route('/dados/contas', methods=['GET'])
@cross_origin()
@token_required
def get_dados_contas(current_user):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute('''  
         SELECT id_tipo_despesa, nome_tipo_despesa, tipo_valor_despesa
         FROM tipo_despesa
        ''')
        tipos_despesas = cursor.fetchall()
        cursor.execute(''' 
        SELECT 
        moradores.id_morador,
        unidade.id_unidade
        FROM
        moradores
        INNER JOIN unidade ON moradores.fk_unidade = unidade.id_unidade
        WHERE 
        moradores.fk_pessoa = %s;
        ''', (current_user,))
        dados_morador = cursor.fetchone()
        cursor.close()
        response = {
             'tipos_despesas': [{'id_tipo_despesa': row[0], 'nome_tipo_despesa': row[1], 'tipo_valor_despesa': row[2]} for row in tipos_despesas ],
             'dados_morador': {
                 'id_morador': dados_morador[0],
                 'id_unidade': dados_morador[1]
             }
        }
        return jsonify(response)
    except Exception as ex:
        print (ex)
        return jsonify({'mensagem': 'Erro na sua api'})

@app.route('/dados/manutencao', methods=['GET'])
@cross_origin()
@token_required
def get_dados_manutencao(current_user):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        
        # Consulta para obter os tipos de manutenção
        cursor.execute('''
        SELECT id_tipo_manutencao, descricao_manutencao
        FROM tipo_manutencao
        ''')
        tipos_manutencao = cursor.fetchall()

        # Consulta para obter os dados do morador logado
        cursor.execute('''
        SELECT 
        moradores.id_morador, 
        unidade.id_unidade
        FROM 
        moradores 
        INNER JOIN unidade ON moradores.fk_unidade = unidade.id_unidade
        WHERE 
        moradores.fk_pessoa = %s;
        ''', (current_user,))
        dados_morador = cursor.fetchone()

        cursor.close()

        # Estrutura a resposta
        response = {
            'tipos_manutencao': [{'id_tipo_manutencao': row[0], 'descricao_manutencao': row[1]} for row in tipos_manutencao],
            'dados_morador': {
                'id_morador': dados_morador[0],
                'id_unidade': dados_morador[1]
            }
        }

        return jsonify(response)
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'})



@app.route('/lista/manutencao_moradores', methods=['GET'])
@cross_origin()
@token_required
def get_manutencao(current_user):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        
        # Supondo que você tenha um objeto db representando sua conexão com o banco de dados
        cursor.execute('''
        SELECT
        manutencao.id_manutencao,
        pessoa.nome_pessoa as nome_morador,
        pessoa.telefone_pessoa as telefone_morador,
	    pessoa.id_pessoa as id_morador,
        pessoa.email as email_morador,
        tipo_manutencao.descricao_manutencao AS nome_manutencao,
        manutencao.descricao_manutencao,
		unidade.id_unidade,
        unidade.metragem_unidade AS unidade,
        manutencao.data_manutencao
        FROM 
        manutencao
        INNER JOIN 
        tipo_manutencao ON manutencao.tipo_manutencao_id = tipo_manutencao.id_tipo_manutencao
        INNER JOIN 
        moradores ON manutencao.morador_id = moradores.id_morador
        INNER JOIN 
        unidade ON moradores.fk_unidade = unidade.id_unidade
        INNER JOIN 
        pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
        WHERE 
        moradores.fk_pessoa =  %s;
        ''', (current_user,))
        
        results = cursor.fetchall()
        manutencao = []
        for row in results:
            manuten = {
                'id_manutencao': row[0],
                'nome_morador': row[1],
                'telefone_morador': row[2],
                'id_morador': row[3],
                'email_morador': row[4],
                'nome_manutencao': row[5],
                'descricao_manutencao': row[6],
                'id_unidade': row[7],
                'unidade': row[8],
                'data_manutencao': row[9]
            }
            manutencao.append(manuten)
        cursor.close()
        return jsonify({'manutencao': manutencao, 'mensagem': 'Manutenções listadas.'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'})


@app.route('/admin/lista/manutencao', methods=['GET'])
@cross_origin()
@token_required  # Verifica se o usuário possui token válido
#@admin_required  # Verifica se o usuário é um administrador
def all_manutencao(user):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()

        cursor.execute('''
    SELECT
    manutencao.id_manutencao,
    pessoa.nome_pessoa AS nome_morador,
    pessoa.telefone_pessoa AS telefone_morador,
    pessoa.id_pessoa AS id_morador,
    pessoa.email AS email_morador,
    tipo_manutencao.descricao_manutencao AS nome_manutencao,
    manutencao.descricao_manutencao,
	bloco.nome_bloco,
    unidade.metragem_unidade AS unidade,  
    manutencao.data_manutencao
    FROM 
    manutencao
    INNER JOIN 
    tipo_manutencao ON manutencao.tipo_manutencao_id = tipo_manutencao.id_tipo_manutencao
    INNER JOIN 
    moradores ON manutencao.morador_id = moradores.id_morador
    INNER JOIN 
    unidade ON moradores.fk_unidade = unidade.id_unidade
    INNER JOIN 
    bloco ON unidade.bloco_id = bloco.id_bloco
    INNER JOIN 
    pessoa ON moradores.fk_pessoa = pessoa.id_pessoa;
    ''')
        
        results = cursor.fetchall()
        manutencao = []
        for row in results:
            manuten = {
                'id_manutencao': row[0],
                'nome_morador': row[1],
                'telefone_morador': row[2],
                'id_morador': row[3],
                'email_morador': row[4],
                'nome_manutencao': row[5],
                'descricao_manutencao': row[6],
                'nome_bloco': row[7],
                'unidade': row[8],
                'data_manutencao': row[9]
            }
            manutencao.append(manuten)
        cursor.close()
        return jsonify({'manutencao': manutencao, 'mensagem': 'Todas as manutenções listadas.'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'})



######## Endpoint que Cadastra Visitante ################
@cross_origin
@app.route('/cadastrar/visitante', methods=['POST'])
def cadastrar_visitante():
    data = request.json
    # Insere a pessoa na tabela pessoa
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO pessoa (nome_pessoa, telefone_pessoa, endereco_id, status_id, bi_pessoa) VALUES (%s, %s, %s, %s, %s) RETURNING id_pessoa",
    (data['nome_pessoa'], data['telefone_pessoa'], data['endereco_id'], data['status_id'], data['bi_pessoa']))
    pessoa_id = cursor.fetchone()[0]  # Obtém o ID da pessoa recém-cadastrada

    # Insere um morador relacionado à pessoa na tabela visitante
    cursor.execute("INSERT INTO visitante (pessoa_id) VALUES (%s)", (pessoa_id,))
    conn.commit()

    # Fecha a conexão com o banco de dados
    cursor.close()
    conn.close()

    return jsonify({'mensagem': 'Visitante cadastrado com sucesso.'})
######## Fim do Endpoint que Cadastra Visitante ##########


@cross_origin
@app.route('/lista/visitante', methods=['GET'])
def get_visitante():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    # Supondo que você tenha um objeto db representando sua conexão com o banco de dados
    cursor.execute('''
       SELECT 
        m.id_visitante,
        m.pessoa_id,
        p.nome_pessoa,
        p.telefone_pessoa,
        e.nome_endereco,
        s.nome_status,
        p.bi_pessoa
        FROM 
        visitante m
        INNER JOIN 
        pessoa p ON m.pessoa_id = p.id_pessoa
        INNER JOIN 
        endereco e ON p.endereco_id = e.id_endereco
        INNER JOIN 
        status s ON p.status_id = s.id_status
    ''')
    results = cursor.fetchall()
    moradores_list = []
    for row in results:
        moradores_list.append({
            'id_visitante': row[0],
            'nome_pessoa': row[2],
            'telefone_pessoa': row[3],
            'endereco_id': row[4],
            'status_id': row[5],
            'bi_pessoa': row[6]
        })
        cursor.close()
    return jsonify(moradores_list)

############### lista de unidades ################3
@cross_origin
@app.route('/lista/unidade', methods=['GET'])
def listar_unidades():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT 
    unidade.id_unidade,
  	unidade.numero_quarto_unidade,
	unidade.metragem_unidade,
    tipounidade.nome_tipo_unidade,   
    bloco.nome_bloco
    FROM 
    unidade
    INNER JOIN 
    tipounidade ON unidade.tipo_unidade_id = tipounidade.id_tipo_unidade
    INNER JOIN 
    bloco ON unidade.bloco_id = bloco.id_bloco;  
    """)
    results = cursor.fetchall()
    unidades = []
    for row in results:
        unidades.append({
            'id_unidade': row[0],
            'numero_quarto_unidade': row[1],
            'metragem_unidade': row[2],
            'nome_tipo_unidade': row[3],
            'nome_bloco': row[4]
        })
        cursor.close()
    return jsonify(unidades)

################ Endpoint Que cadastra Áreas comuns ############
@cross_origin
@app.route('/cadastrar/area_reserva', methods=['POST'])
def cadastrar_area():
    data = request.json
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO area_reserva (bloco_id, descricao) 
    VALUES (%s, %s)
    """, (data['bloco_id'], data['descricao']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensagem': 'Áreas comuns cadastradas com sucesso!'}), 200
############### Fim do Endpoint que Cadastra áreas comuns ########

################ Endpoint que cadastra pedido de manutenções ############

@app.route('/cadastrar/pedido_manutencao', methods=['POST'])
@cross_origin()
def cadastrar_manutencao():
    data = request.json
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO manutencao (tipo_manutencao_id,
    descricao_manutencao, morador_id, unidade_id, data_manutencao) 
    VALUES (%s, %s, %s, %s, NOW())
    """, (data['tipo_manutencao_id'],
          data['descricao_manutencao'], 
          data['morador_id'],
          data['unidade_id']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensagem': 'Pedido de manutencao com sucesso!'}), 200
########### Fim do Endpoint que Cadastra áreas comuns ########

@app.route('/dados/reservas', methods=['GET'])
@cross_origin()
@token_required
def get_dados_reservas(current_user):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(''' 
          SELECT 
        moradores.id_morador, 
        unidade.id_unidade
        FROM 
        moradores 
        INNER JOIN unidade ON moradores.fk_unidade = unidade.id_unidade
        WHERE 
        moradores.fk_pessoa = %s;
        ''', (current_user,))
        dados_morador = cursor.fetchone()
        cursor.close()
        conn.close()
        response = {
           'dados_morador': {
               'id_morador': dados_morador[0],
               'id_unidade': dados_morador[1]
           } 
        }
        return jsonify(response)
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'})

@cross_origin
@app.route('/cadastrar/reservas', methods=['POST'])
def cadastrar_reservas():
    data = request.json
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO reservas (morador_id, tipo_reserva_id, bloco_id, data_da_reserva, inicio_reserva, fim_reserva) 
    VALUES (%s, %s, %s, %s, %s, %s)
    """, (data['morador_id'], data['tipo_reserva_id'], data['bloco_id'], data['data_da_reserva'], data['inicio_reserva'], data['fim_reserva']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensagem': 'Reservas cadastrado com sucesso!'}), 200
############### Fim do Endpoint que Cadastra áreas comuns ########

################ Endpoint Que cadastra Visitantes ############
UPLOAD_FOLDER = 'C:/xampp/htdocs/condoflow/backAPI/src/visitantes'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def create_directory_if_not_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

create_directory_if_not_exists(UPLOAD_FOLDER)

def connect_to_database():
    try:
        conn = psycopg2.connect(
            dbname="condoflow_db",
            user="postgres",
            password="Angola2023#",
            host="95.216.215.24"
        )
        return conn
    except Exception as e:
        traceback.print_exc()
        raise e

def cadastrar_despesa_no_banco(nome_visitante, apelido_visitante,contacto_visitante, bilhete_visitante, bloco_id, unidade_id, filename):
    conn = connect_to_database()
    cursor = conn.cursor()
    try:
        cursor.execute(""" 
        INSERT INTO visitantes (nome_visitante, apelido_visitante, contacto_visitante, bilhete_visitante, bloco_id, unidade_id, comprovativo_despesa) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)              
        """, (nome_visitante, apelido_visitante, contacto_visitante, bilhete_visitante, bloco_id, unidade_id, filename))
        conn.commit()
        return True
    except Exception as e:
        traceback.print_exc()
        return False
    finally:
        cursor.close()
        conn.close()

@cross_origin
@app.route('/cadastrar/emergencia', methods=['POST'])
def cadastrar_emergencia():
    data = request.json
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO emergencia (morador_id, unidade_id, tipo_emergencia, data_hora_emergencia) 
    VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
    """, (data['morador_id'], data['unidade_id'], data['tipo_emergencia']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensagem': 'Emergência cadastrada com sucesso!'}), 200


@app.route('/listar/emergencias', methods=['GET'])
@cross_origin()
@token_required
def listar_emergencias(current_user):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()

        cursor.execute("""
        SELECT 
            emergencia.id_emergencia,
            pessoa.nome_pessoa AS nome_morador,
            pessoa.telefone_pessoa AS telefone_morador,
          
            pessoa.email AS email_morador,
            emergencia.tipo_emergencia,
            emergencia.data_hora_emergencia,
           
            unidade.metragem_unidade AS unidade
        FROM 
            emergencia
        INNER JOIN 
            moradores ON emergencia.morador_id = moradores.id_morador
        INNER JOIN 
            unidade ON moradores.fk_unidade = unidade.id_unidade
        INNER JOIN 
            pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
        WHERE 
            moradores.fk_pessoa = %s
        ORDER BY 
            emergencia.data_hora_emergencia DESC
        """, (current_user,))
        
        emergencias = cursor.fetchall()

        cursor.close()
        conn.close()

        response = []
        for emergencia in emergencias:
            response.append({
                'id_emergencia': emergencia[0],
                'nome_morador': emergencia[1],
                'telefone_morador': emergencia[2],              
                'email_morador': emergencia[3],
                'tipo_emergencia': emergencia[4],
                'data_hora_emergencia': emergencia[5],                
                'metragem_unidade': emergencia[6]
            })

        return jsonify({'emergencia': response}), 200

    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro ao listar emergências'}), 500


@app.route('/cadastrar/visitas', methods=['POST'])
@cross_origin()
def cadastrar_visitas():
    try:
        if 'comprovativo_despesa' not in request.files:
            return jsonify({'Error': 'No file part'}), 400
        
        comprovativo_despesa = request.files.get('comprovativo_despesa')
        if comprovativo_despesa.filename == '':
            return jsonify({'Error': 'No selected file'}), 400
        filename = secure_filename(comprovativo_despesa.filename)
        dst = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        comprovativo_despesa.save(dst)
        
        nome_visitante = request.form.get('nome_visitante')
        apelido_visitante = request.form.get('apelido_visitante')
        contacto_visitante = request.form.get('contacto_visitante')
        bilhete_visitante = request.form.get('bilhete_visitante')
        bloco_id = request.form.get('bloco_id')
        unidade_id = request.form.get('unidade_id')
        
        if not all([nome_visitante, apelido_visitante, contacto_visitante, bilhete_visitante, bloco_id, unidade_id]):
            return jsonify({'error': 'Todos os campos devem ser preenchidos.'}), 400
        if cadastrar_despesa_no_banco(nome_visitante, apelido_visitante, contacto_visitante, bilhete_visitante, bloco_id, unidade_id, filename):
            return jsonify({'mensagem': 'Novo Visitante cadastrado com sucesso.'}), 200
        else:
            return jsonify({'error': 'Erro ao cadastrar o visitante.'}), 500
    
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': 'Erro interno ao processar a requisição.'}), 500
   
############### Fim do Endpoint que Cadastra Visitantes ########

@app.route('/visitantes/<path:filename>', methods=["GET"])
def serve_fi(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

############### Lista Áreas reservas ##################

@app.route('/lista/visitas', methods=['GET'])
@cross_origin()
@token_required
def listar_visitas(current_user):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT 
        visitantes.id_visitante,
        visitantes.nome_visitante,
        visitantes.apelido_visitante,
        visitantes.contacto_visitante,
        visitantes.bilhete_visitante,
        bloco.nome_bloco,
        unidade.metragem_unidade as nome_unidade,
        visitantes.estado,
        pessoa.nome_pessoa as nome_morador,
        pessoa.email as email_morador,
        pessoa.telefone_pessoa as telefone_morador,
		visitantes.comprovativo_despesa as imagem_do_visitante
        FROM 
        visitantes 
        INNER JOIN 
        bloco ON visitantes.bloco_id = bloco.id_bloco
        INNER JOIN 
        unidade ON visitantes.unidade_id = unidade.id_unidade
        INNER JOIN 
        moradores ON unidade.id_unidade = moradores.fk_unidade
        INNER JOIN
        pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
        WHERE visitantes.estado = 'Não Autorizado'
        AND moradores.fk_pessoa = %s
        """, (current_user,))
        results = cursor.fetchall()
        visitas = []
        for row in results:
            visit = {
                'id_visitante': row[0],
                'nome_visitante': row[1],
                'apelido_visitante': row[2],
                'contacto_visitante': row[3],
                'bilhete_visitante': row[4],
                'nome_bloco': row[5],
                'nome_unidade': row[6],
                'estado': row[7],
                'nome_morador': row[8],
                'email_morador': row[9],
                'telefone_morador': row[10],
                'imagem_do_visitante':row[11]
            }
            visitas.append(visit)
        cursor.close()
        return jsonify({'visitas': visitas, 'mensagem': 'Visitantes listados com sucesso.'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'}), 500    
############## Fim da listagem Áreas reservas ###########


@app.route('/lista/visitantes/admin', methods=['GET'])
@cross_origin()
def listar_admin_visitas():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("""  
SELECT 
visitantes.id_visitante,
visitantes.nome_visitante,
visitantes.apelido_visitante,
visitantes.contacto_visitante,
visitantes.bilhete_visitante,
bloco.nome_bloco,
unidade.metragem_unidade as nome_unidade,
visitantes.estado,
visitantes.comprovativo_despesa as imagem_do_visitante
FROM 
visitantes 
INNER JOIN 
bloco ON visitantes.bloco_id = bloco.id_bloco
INNER JOIN 
unidade ON visitantes.unidade_id = unidade.id_unidade                                 
        """)
        results = cursor.fetchall()
        visitas = []
        for row in results:
            visit = {
                'id_visitante': row[0],
                'nome_visitante': row[1],
                'apelido_visitante': row[2],
                'contacto_visitante': row[3],
                'bilhete_visitante': row[4],
                'nome_bloco': row[5],
                'nome_unidade': row[6],
                'estado': row[7],
                'imagem_do_visitante':row[11]
            }
            visitas.append(visit)
        cursor.close()
        return jsonify({'visitas': visitas, 'mensagem': 'Visitantes listados com sucesso.'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'}), 500 

############################## ###########################
@app.route('/lista/visitantes/seguranca', methods=['GET'])
@cross_origin()
def listar_seguranca_visitas():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("""  
        SELECT 
        visitantes.id_visitante,
        visitantes.nome_visitante,
        visitantes.apelido_visitante,
        visitantes.contacto_visitante,
        visitantes.bilhete_visitante,
        bloco.nome_bloco,
        unidade.metragem_unidade as nome_unidade,
        visitantes.estado,
        pessoa.nome_pessoa as nome_morador,
        pessoa.email as email_morador,
        pessoa.telefone_pessoa as telefone_morador,
		visitantes.comprovativo_despesa as imagem_do_visitante
        FROM 
        visitantes 
        INNER JOIN 
        bloco ON visitantes.bloco_id = bloco.id_bloco
        INNER JOIN 
        unidade ON visitantes.unidade_id = unidade.id_unidade
        INNER JOIN 
        moradores ON unidade.id_unidade = moradores.fk_unidade
        INNER JOIN
        pessoa ON moradores.fk_pessoa = pessoa.id_pessoa                                  
        """)
        results = cursor.fetchall()
        visitas = []
        for row in results:
            visit = {
                'id_visitante': row[0],
                'nome_visitante': row[1],
                'apelido_visitante': row[2],
                'contacto_visitante': row[3],
                'bilhete_visitante': row[4],
                'nome_bloco': row[5],
                'nome_unidade': row[6],
                'estado': row[7],
                'nome_morador': row[8],
                'email_morador': row[9],
                'telefone_morador': row[10],
                'imagem_do_visitante':row[11]
            }
            visitas.append(visit)
        cursor.close()
        return jsonify({'visitas': visitas, 'mensagem': 'Visitantes listados com sucesso.'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'}), 500    

@app.route('/visitante/seguranca/<int:id>', methods=['GET'])
@cross_origin()
def get_visita(id):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("""
SELECT 
visitantes.id_visitante,
visitantes.nome_visitante,
visitantes.apelido_visitante,
visitantes.contacto_visitante,
visitantes.bilhete_visitante,
bloco.nome_bloco,
unidade.metragem_unidade as nome_unidade,
visitantes.estado,
pessoa.nome_pessoa as nome_morador,
pessoa.email as email_morador,
pessoa.telefone_pessoa as telefone_morador,
visitantes.comprovativo_despesa as imagem_do_visitante
FROM 
visitantes 
INNER JOIN 
bloco ON visitantes.bloco_id = bloco.id_bloco
INNER JOIN 
unidade ON visitantes.unidade_id = unidade.id_unidade
INNER JOIN 
moradores ON unidade.id_unidade = moradores.fk_unidade
INNER JOIN
pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
WHERE visitantes.id_visitante = %s
""", (id,))
        row = cursor.fetchone()
        if row:
            visit = {
                'id_visitante': row[0],
                'nome_visitante': row[1],
                'apelido_visitante': row[2],
                'contacto_visitante': row[3],
                'bilhete_visitante': row[4],
                'nome_bloco': row[5],
                'nome_unidade': row[6],
                'estado': row[7],
                'nome_morador': row[8],
                'email_morador': row[9],
                'telefone_morador': row[10],
                'imagem_do_visitante': row[11]
            }
            cursor.close()
            return jsonify({'visitante': visit, 'mensagem': 'Visitante encontrado com sucesso.'})
        else:
            cursor.close()
            return jsonify({'mensagem': 'Visitante não encontrado'}), 404
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'}), 500
            
@app.route('/total_visitantes_por_pessoa', methods=['GET'])
@token_required  # Aplicando o decorator token_required
def total_visitantes_por_pessoa(current_user):
    try:
        pessoa_id = request.args.get('pessoa_id')  # Obtenha o ID da pessoa a partir dos parâmetros da requisição
        if not pessoa_id:
            return jsonify({'mensagem': 'ID da pessoa não fornecido'}), 400
        
        # Consulta SQL
        sql_query = """
            SELECT 
                pessoa.id_pessoa,
                COUNT(visitantes.id_visitante) AS total_de_visitantes
            FROM 
                pessoa
            INNER JOIN 
                moradores ON pessoa.id_pessoa = moradores.fk_pessoa
            INNER JOIN 
                unidade ON moradores.fk_unidade = unidade.id_unidade
            INNER JOIN 
                visitantes ON unidade.id_unidade = visitantes.unidade_id
            WHERE 
                moradores.fk_pessoa = %s
            GROUP BY 
                pessoa.id_pessoa;
        """, 
        
        # Executando a consulta
        with db.engine.connect() as connection:
            result = connection.execute(sql_query, pessoa_id)
            rows = result.fetchall()
        
        if not rows:
            return jsonify({'mensagem': 'Nenhuma visita encontrada para a pessoa especificada'}), 404
        
        # Formatando o resultado
        total_visitantes = []
        for row in rows:
            total_visitantes.append({
                'id_pessoa': row[0],
                'total_de_visitantes': row[1]
            })
        
        return jsonify(total_visitantes)
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro ao processar a solicitação'}), 500


@app.route('/unidades/maior-frequencia-visitas', methods=['GET'])
@cross_origin()
def get_units_with_most_visits():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("""
SELECT 
unidade.id_unidade, 
unidade.metragem_unidade as nome_da_unidade,
COUNT(visitantes.id_visitante) AS total_de_visitas,
pessoa.nome_pessoa as nome_do_morador
FROM 
visitantes 
INNER JOIN 
unidade ON visitantes.unidade_id = unidade.id_unidade
INNER JOIN
moradores ON unidade.id_unidade = moradores.fk_unidade
INNER JOIN
pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
GROUP BY 
unidade.id_unidade, unidade.metragem_unidade, pessoa.nome_pessoa
HAVING 
COUNT(visitantes.id_visitante) >= 10
ORDER BY 
total_de_visitas DESC;
""")
        
        rows = cursor.fetchall()
        unidades = [
            {
            'id_unidade': row[0],
            'nome_da_unidade': row[1],
            'total_de_visitas': row[2],
            'nome_do_morador':row[3]
            } 
            for row in rows
        ]
        
        cursor.close()
        conn.close()
        
        return jsonify({'unidades': unidades, 'mensagem': 'Unidades com maior frequência de visitas encontrada com sucesso.'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'}), 500

    

@app.route('/lista/morador/unidade/<int:unidade_id>', methods=['GET'])
@cross_origin()
def get_morador_by_unidade(unidade_id):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT 
            pessoa.nome_pessoa as nome_morador
        FROM 
            moradores
        INNER JOIN 
            pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
        WHERE 
            moradores.fk_unidade = %s
        """, (unidade_id,))
        result = cursor.fetchone()
        cursor.close() 
        if result:
            return jsonify({'nome_morador': result[0]})
        else:
            return jsonify({'mensagem': 'Não existe nenhum morador associado a essa unidade.'}), 404
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'}), 500




############## Permitir Acesso ao Visitante ###############
@cross_origin
@app.route('/aprovar/visita/<int:id_visitante>', methods=['PUT'])

def aprovar_visita(id_visitante):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        
        # Atualize o estado da reserva para 'confirmado'
        cursor.execute(       
"""
UPDATE visitantes
SET estado = 'Autorizado'
WHERE id_visitante = %s
""", (id_visitante,))       
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'mensagem': 'Visita autorizado a entrar!'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500
############ Fim do Endpoint de permissão do visitante ############ 

############## Permitir Acesso ao Visitante ###############
@cross_origin
@app.route('/aprovar/pagamento/<int:id_despesa>', methods=['PUT'])

def aprovar_pagamento(id_despesa):
    try:
        print(f"Recebido id_despesa: {id_despesa}")
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
        UPDATE despesas
        SET estado = 'Pago'
        WHERE id_despesa = %s
        """, (id_despesa,))       
        conn.commit()
        cursor.close()      
        return jsonify({'mensagem': 'Despesa pago!'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500
############ Fim do Endpoint de permissão do visitante ############ 


############### Lista Áreas reservas ##################
@cross_origin
@app.route('/lista/areas_reserva', methods=['GET'])
def listar_areas():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT 
    area_reserva.id_area_reserva,
    bloco.nome_bloco,
  	area_reserva.descricao
    FROM 
    area_reserva
    INNER JOIN 
    bloco ON area_reserva.bloco_id = bloco.id_bloco;  
    """)
    results = cursor.fetchall()
    areas_reservas = []
    for row in results:
        areas_reservas.append({
        'id_area_reserva': row[0],
        'nome_bloco': row[1],
        'descricao': row[2]
        
        })
        cursor.close()
    return jsonify(areas_reservas)
############## Fim da listagem Áreas reservas ###########


@app.route('/lista/emergencias', methods=['GET'])
@cross_origin()
def list():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("""
   SELECT 
    emergencia.id_emergencia,
    pessoa.nome_pessoa AS nome_morador,
    pessoa.telefone_pessoa AS telefone_morador,
    pessoa.email AS email_morador,
    emergencia.tipo_emergencia,
    emergencia.data_hora_emergencia,
    unidade.metragem_unidade AS unidade,
    bloco.nome_bloco AS nome_bloco  
FROM 
    emergencia
INNER JOIN 
    moradores ON emergencia.morador_id = moradores.id_morador
INNER JOIN 
    unidade ON moradores.fk_unidade = unidade.id_unidade
INNER JOIN 
    pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
INNER JOIN 
    bloco ON unidade.bloco_id = bloco.id_bloco 
ORDER BY 
    emergencia.data_hora_emergencia DESC;
    """)
    results = cursor.fetchall()
    emergencias = []
    for row in results:
        emergencias.append({
        'id_emergencia': row[0],
        'nome_morador': row[1],
        'telefone_morador': row[2],
        'email_morador': row[3],
        'tipo_emergencia': row[4],
        'data_hora_emergencia': row[5],
        'unidade': row[6],
        'bloco': row[7]
        })
        cursor.close()
    return jsonify({'emergencias':emergencias})
############## Fim da listagem Áreas reservas ###########


############### Lista Áreas reservas ##################
@cross_origin
@app.route('/lista/eventos', methods=['GET'])
def listar_eventos():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT 
    eventos.id_eventos,
    eventos.numeros_vagas_eventos,
    bloco.nome_bloco,
    TO_CHAR(eventos.data_inicio_eventos, 'DD-MM-YYYY') AS data_inicio_eventos,
    TO_CHAR(eventos.data_fim_eventos, 'DD-MM-YYYY') AS data_fim_eventos,
    TO_CHAR(eventos.data_eventos, 'DD-MM-YYYY') AS data_eventos
FROM 
    eventos 
INNER JOIN 
    bloco ON eventos.bloco_id = bloco.id_bloco;

    """)
    results = cursor.fetchall()
    eventos = []
    for row in results:
        eventos.append({
        'id_eventos': row[0],
        'numeros_vagas_eventos': row[1],
        'nome_bloco': row[2],
        'data_inicio_eventos': row[3],
        'data_fim_eventos': row[4],
        'data_eventos': row[5]
        })
        cursor.close()
    return jsonify(eventos)
############## Fim da listagem Áreas reservas ###########


######## Endpoint que Cadastra Visitante ################
@cross_origin
@app.route('/cadastrar/sindico', methods=['POST'])
def cadastrar_sindico():
    data = request.json
    # Insere a pessoa na tabela pessoa
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO pessoa (nome_pessoa, telefone_pessoa, endereco_id, status_id, bi_pessoa) VALUES (%s, %s, %s, %s, %s) RETURNING id_pessoa",
    (data['nome_pessoa'], data['telefone_pessoa'], data['endereco_id'], data['status_id'], data['bi_pessoa']))
    pessoa_id = cursor.fetchone()[0]  # Obtém o ID da pessoa recém-cadastrada

    # Insere um morador relacionado à pessoa na tabela síndico
    cursor.execute("INSERT INTO sindico (pessoa_id) VALUES (%s)", (pessoa_id,))
    conn.commit()

    # Fecha a conexão com o banco de dados
    cursor.close()
    conn.close()

    return jsonify({'mensagem': 'Síndico cadastrado com sucesso.'})
######## Fim do Endpoint que Cadastra Visitante ##########
    
################# Apresenta o último registo de Visitas ############
@cross_origin
@app.route('/lista/permissao/visitas', methods=['GET'])
def listar_permissao():
    try:
       conn = db.engine.raw_connection()
       cursor = conn.cursor()
       cursor.execute("""  
        SELECT 
        *
        FROM visitantes
        ORDER BY id_visitante DESC
        LIMIT 1;              
        """)
       results = cursor.fetchall()
       permissao = []
       for fila in results:
           visitas = {
            'id_visitante': fila[0],
            'estado': fila[7]
           }
           permissao.append(visitas)
       cursor.close()
       return jsonify(permissao)
    except Exception as ex:
        print(ex)
        return jsonify({'Mensagem': 'Erro na sua api'})

#################### Lista dos porteiros ################

@cross_origin
@app.route('/lista/porteiros', methods=['GET'])

def listar_porteiro():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    # Supondo que você tenha um objeto db representando sua conexão com o banco de dados
    cursor.execute('''
       SELECT 
        id_porteiro,
        nome_porteiro,
        telefone_porteiro,
        bi_porteiro,
        email_porteiro,
        senha_porteiro                                            
        FROM 
        porteiro
    ''')
    results = cursor.fetchall()
    porteiros_list = []
    for row in results:
        porteiros_list.append({
            'id_porteiro': row[0],
            'nome_porteiro': row[1],
            'telefone_porteiro': row[2],
            'bi_porteiro': row[3],
            'email_porteiro': row[4],
            'senha_porteiro': row[5]
        })
        cursor.close()
    return jsonify(porteiros_list)

################### Fim da listagem #####################



############### FIM da apresentação do último Registo ##############    
       
@cross_origin
@app.route('/lista/sindico', methods=['GET'])
def get_sindico():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    # Supondo que você tenha um objeto db representando sua conexão com o banco de dados
    cursor.execute('''
        SELECT
        id_sindico,
        nome_sindico,
        telefone_sindico,
        bi_sindico,
        email_sindico
        FROM 
        sindico
    ''')
    results = cursor.fetchall()
    moradores_list = []
    for row in results:
        moradores_list.append({
            'id_sindico': row[0],
            'nome_sindico': row[1],
            'telefone_sindico': row[2],
            'bi_sindico': row[3],
            'email_sindico': row[4]
        })
        cursor.close()
    return jsonify(moradores_list)

################ Endpoint de Cadastrar Reservas ##############

################ Endpoint de Cadastrar Reservas ##############
@cross_origin
@app.route('/cadastrar/moradores', methods=['POST'])
def registar_moradores():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(""" INSERT INTO moradores
        (nome_morador ,
        email_morador, 
        telefone_morador, 
        unidade_id, 
        senha_morador) VALUES 
        ('{0}', '{1}', '{2}', '{3}', '{4}')               
        """.format(request.json['nome_morador'],
        request.json['email_morador'], 
        request.json['telefone_morador'],
        request.json['unidade_id'],
        request.json['senha_morador']
        ))
        conn.commit()
        return jsonify({'mensagem': 'Morador cadastrado com sucesso.'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500  
################ Fim de cadastrar Reservas ###################

################ Endpoint de Cadastrar Tipo de Despesa ##############
@cross_origin
@app.route('/cadastrar/tipoDespesas', methods=['POST'])
def registar_tipoDespesas():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(""" INSERT INTO tipo_despesa
        (nome_despesa ,
        valor_despesa) VALUES 
        ('{0}', '{1}')               
        """.format(request.json['nome_despesa'],
        request.json['valor_despesa']
        ))
        conn.commit()
        return jsonify({'mensagem': 'Despesa cadastrado com sucesso.'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500  
################ Fim de cadastrar Reservas ###################


################ Endpoint de Cadastrar Tipo de Manutenção ##############
@cross_origin
@app.route('/cadastrar/tipoManutencao', methods=['POST'])
def registar_tipoManu():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(""" INSERT INTO tipo_manutencao
        (descricao_manutencao) VALUES 
        ('{0}')               
        """.format(request.json['descricao_manutencao']
        ))
        conn.commit()
        return jsonify({'mensagem': 'Tipo de manutencao cadastrado com sucesso.'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500  
    
################ Fim de cadastro odo tipo de manutenção ###################

################ Endpoint de Eventos ##############
@cross_origin
@app.route('/cadastrar/eventos', methods=['POST'])
def registar_eventos():
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute(""" INSERT INTO eventos
        (numeros_vagas_eventos ,bloco_id, 
        data_inicio_eventos, data_fim_eventos) VALUES 
        ('{0}', '{1}', '{2}', '{3}')               
        """.format(request.json['numeros_vagas_eventos'],
        request.json['bloco_id'], 
        request.json['data_inicio_eventos'],
        request.json['data_fim_eventos']
        ))
        conn.commit()
        return jsonify({'mensagem': 'Eventos cadastrado com sucesso.'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500
    
################ Fim de cadastrar Eventos ###################

@cross_origin
@app.route('/aprovar/reserva/<int:id_reserva>', methods=['PUT'])

def aprovar_reserva(id_reserva):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        
        # Atualize o estado da reserva para 'confirmado'
        cursor.execute(       
"""
UPDATE reservas
SET estado = 'aprovado'
WHERE id_reserva = %s
""", (id_reserva,))       
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'mensagem': 'Reserva aprovada com sucesso.'}), 200
    except Exception as ex:
        print(ex)
        return jsonify({'erro': 'Erro na sua API'}), 500

####################### Endpoint que lista todas reservas ##############

######### Endpoint que pega Pessoas por id ##########
@app.route('/aprovar/reserva/id/<int:id_reserva>', methods=['GET'])
def reserva_por_id(id_reserva):
    
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reservas WHERE id_reserva = %s", (id_reserva,))
    results = cursor.fetchone()
    reserva = None
    if results != None:
     reserva = {
         'id_reserva':results[0], 
         'usuario_id':results[1], 
         'bloco_id':results[2], 
         'data_reserva':results[3], 
         'estado':results[4]
         }  
    cursor.close()
    if id_reserva: 
        return jsonify({'Reserva':reserva, 'Mensagem':'Reserva encontrada'}), 200
    else:
     return jsonify({'message': 'Pessoa não encontrado'}), 404
    
@app.route('/admin/lista/reservas', methods=['GET'])
@cross_origin()
@token_required
def all_reservas(user):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()

        cursor.execute('''
SELECT 
    reservas.id_reserva, 
    pessoa.nome_pessoa as nome_morador,
    pessoa.email as email_morador,
    pessoa.telefone_pessoa as telefone_morador,
    pessoa.bi_pessoa as bi_morador,
    bloco.nome_bloco,
    unidade.metragem_unidade as nome_unidade,
    tipo_reserva.nome_tipo_reserva,
    reservas.data_da_reserva,
    TO_CHAR(reservas.inicio_reserva, 'HH24:MI') as inicio_reserva,
    TO_CHAR(reservas.fim_reserva, 'HH24:MI') as fim_reserva,
    TO_CHAR((reservas.fim_reserva - reservas.inicio_reserva), 'HH24:MI:SS') as total_horas,
    reservas.estado
FROM 
    reservas 
INNER JOIN 
    moradores ON reservas.morador_id = moradores.id_morador
INNER JOIN 
    pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
INNER JOIN
    bloco ON reservas.bloco_id = bloco.id_bloco
INNER JOIN 
    unidade ON bloco.id_bloco = unidade.bloco_id
INNER JOIN
    tipo_reserva ON reservas.tipo_reserva_id = tipo_reserva.id_tipo_reserva                     
''')
        
        results = cursor.fetchall()
        admin = []
        for row in results:
            admins = {
                'id_reserva': row[0],
                'nome_morador': row[1],
                'email_morador': row[2],
                'telefone_morador': row[3],
                'bi_morador': row[4],
                'nome_bloco': row[5],
                'nome_unidade': row[6],
                'nome_tipo_reserva': row[7],
                'data_da_reserva': row[8],
                'inicio_reserva': row[9],
                'fim_reserva': row[10],
                'total_horas': row[11],
                'estado': row[12]
            } 
            admin.append(admins)
        
        cursor.close()
        conn.close()
        
        return jsonify({'admin': admin, 'mensagem': 'Todos pedidos de reservas'})
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'})



@app.route('/lista/reservas', methods=['GET'])
@cross_origin()
@token_required
def get_reservas(current_user):
    try:
        conn = db.engine.raw_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
    reservas.id_reserva, 
    pessoa.nome_pessoa as nome_morador,
    pessoa.email as email_morador,
    pessoa.telefone_pessoa as telefone_morador,
    pessoa.bi_pessoa as bi_morador,
    bloco.nome_bloco,
    unidade.metragem_unidade as nome_unidade,
    tipo_reserva.nome_tipo_reserva,
    reservas.data_da_reserva,
    TO_CHAR(reservas.inicio_reserva, 'HH24:MI') as inicio_reserva,
    TO_CHAR(reservas.fim_reserva, 'HH24:MI') as fim_reserva,
    TO_CHAR((reservas.fim_reserva - reservas.inicio_reserva), 'HH24:MI:SS') as total_horas,
    reservas.estado
FROM 
    reservas 
INNER JOIN 
    moradores ON reservas.morador_id = moradores.id_morador
INNER JOIN 
    pessoa ON moradores.fk_pessoa = pessoa.id_pessoa
INNER JOIN
    bloco ON reservas.bloco_id = bloco.id_bloco
INNER JOIN 
    unidade ON bloco.id_bloco = unidade.bloco_id
INNER JOIN
    tipo_reserva ON reservas.tipo_reserva_id = tipo_reserva.id_tipo_reserva
WHERE 
    moradores.fk_pessoa = %s;

        ''', (current_user,))
        
        results = cursor.fetchall()
        reservas_list = []
        
        for row in results:
            reserva = {
                'id_reserva': row[0],
                'nome_morador': row[1],
                'email_morador': row[2],
                'telefone_morador': row[3],
                'bi_morador': row[4],
                'nome_bloco': row[5],
                'nome_unidade': row[6],
                'nome_tipo_reserva': row[7],  # Adicionei o campo nome_tipo_reserva
                'data_da_reserva': row[8],
                'inicio_reserva': row[9],
                'fim_reserva': row[10],
                'total_horas': row[11],
                'estado': row[12]
            }
            reservas_list.append(reserva)
        
        cursor.close()
        conn.close()
        
        return jsonify({'reservas': reservas_list, 'mensagem': 'Reservas listadas.'})
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensagem': 'Erro na sua API'})




@cross_origin
@app.route('/lista/reservas/todos', methods=['GET'])
def get_reservas_todos():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    # Supondo que você tenha um objeto db representando sua conexão com o banco de dados
    cursor.execute('''
      SELECT r.id_reserva, 
       u.email_usuario as email_usuario, 
       b.nome_bloco,
       r.data_da_reserva,
       r.status
       FROM reservas r
        INNER JOIN usuario u ON r.usuario_id = u.id_usuario
        INNER JOIN bloco b ON r.bloco_id = b.id_bloco 

    ''')
    results = cursor.fetchall()
    reservas_list = []
    for row in results:
        reservas_list.append({
            'id_reserva': row[0],
            'email_usuario': row[1],
            'nome_bloco': row[2],
            'data_da_reserva': row[3],
            'status': row[4],
        })
        cursor.close()
    return jsonify(reservas_list)


@cross_origin
@app.route('/lista/reservasAprovado', methods=['GET'])
def get_reservas_aprovados():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    # Supondo que você tenha um objeto db representando sua conexão com o banco de dados
    cursor.execute('''
      SELECT r.id_reserva, 
       u.email_usuario as email_usuario, 
       b.nome_bloco,
       r.data_da_reserva,
       r.estado
       FROM reservas r
        INNER JOIN usuario u ON r.usuario_id = u.id_usuario
        INNER JOIN bloco b ON r.bloco_id = b.id_bloco 
		WHERE r.estado = 'aprovado'
    ''')
    results = cursor.fetchall()
    reservas_list = []
    for row in results:
        reservas_list.append({
            'id_reserva': row[0],
            'email_usuario': row[1],
            'nome_bloco': row[2],
            'data_da_reserva': row[3],
            'estado': row[4],
        })
        cursor.close()
    return jsonify(reservas_list)

###################### Fim do Endpoint que lista reservas ###############


@cross_origin
@app.route('/lista/visitantesAutorizado', methods=['GET'])
def get_visitantes_aprovados():
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    # Supondo que você tenha um objeto db representando sua conexão com o banco de dados
    cursor.execute('''   
      SELECT 
    visitantes.id_visitante,
    visitantes.nome_visitante,
    visitantes.apelido_visitante,
    visitantes.contacto_visitante,
    visitantes.bilhete_visitante,
    bloco.nome_bloco,
    unidade.metragem_unidade,
    visitantes.estado
    FROM 
    visitantes 
    INNER JOIN 
    bloco ON visitantes.bloco_id = bloco.id_bloco
    INNER JOIN 
    unidade ON visitantes.unidade_id = unidade.id_unidade
    WHERE visitantes.estado = 'Autorizado'
    ''')
    results = cursor.fetchall()
    visitantes_aprovado = []
    for row in results:
        visitantes_aprovado.append({
            'id_visitante': row[0],
            'nome_visitante': row[1],
            'apelido_visitante': row[2],
            'contacto_visitante': row[3],
            'bilhete_visitante': row[4],
            'nome_bloco': row[5],
            'metragem_unidade': row[6],
            'estado': row[7],
        })
        cursor.close()
    return jsonify(visitantes_aprovado)


#SELECT r.id_reserva, 
#u.email_usuario as email_usuario, 
#b.nome_bloco,
#r.data_da_reserva,
#r.status
#FROM reservas r
#INNER JOIN usuario u ON r.usuario_id = u.id_usuario
#INNER JOIN bloco b ON r.bloco_id = b.id_bloco


def pagina_nao_encontrada(error):
    print(error)
    return "<p style='font-family:verdana;font-size:20px;'> A página que tentas buscar não existe! </p>"    

if __name__=='__main__':
    socketio.run(app, port=5000, debug=True)
    app.register_error_handler(404,pagina_nao_encontrada)
    app.run(debug=True)
    