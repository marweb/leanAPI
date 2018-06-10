    # LEAN API con NODEJS
    
    Correr dependenccias con:
    npm install 
    Después correr el app con el siguiente comando:
    node app.js
    
    # API Endpoints
    
    El Servidor API corre en el puerto 3000
    
    GET /api/projects/
    Listar todos los proyectos
    
    POST /api/projects
    Crear un nuevo proyecto
    
    GET /api/project/:id
    Ver proyecto por ID
    
    POST /api/project
    Edita un Proyecto
    
    GET /api/project/remove/:id
    Cambia estado de proyecto no lo elimina solo cambia el estado en la DB.
    
    GET /api/project/erase/:id
    
    Elimina proyecto de la DB.