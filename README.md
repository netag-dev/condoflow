O Fronted foi desenvolvido com Angular e para rodar segue abaixo as instruções: 

1 - Acessar até ao diretório frontend/sakai-ng.
2 - No diretório /sakai-ng digite o comando de execução: ng serve -o
3 - Daí notarás que o projeto vai rodar "Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ "

O backend foi desenvolvido com python nomeadamente flask e para rodar segue abaixo as instruções: 

1 - Antes de tudo precisamos ativar a variável de ambiente "source myenv/bin/activate a partir da raiz do backend backAPI"
2 - A partir da raiz do backend backAPI rodar o seguinte comando: python3 src/app.py
3 - Daí notarás que o projeto vai rodar " * Serving Flask app 'app' * Debug mode: on WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
* Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 545-032-997"

Sistema desenvolvido seguindo arquitetura de Microserviços onde o frontend e o backend estão sendo executado de formas separadas... 
