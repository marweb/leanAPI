const express = require('express')
const bodyParser = require('body-parser');
const moment = require('moment');

const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

// Create Express server
const app = express()
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
	extended: true
})); // support encoded bodies

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); 

// Create database instance and start server
const adapter = new FileAsync('db.json')
low(adapter)
	.then(db => {
		// Routes
		// GET /projects - List projects by Status Active
		app.get('/api/projects/', (req, res) => {
			const projects = db.get('projects')
				.filter({
					estado: "1"
				})
				.sortBy('id')
				.value()

			res.send(projects)
		})

		// POST /projects - Create Project
		app.post('/api/projects', (req, res) => {
			var name = req.body.name;
			var image = req.body.image;
			var description = req.body.description;
            //var date = Date.now();
            var date = moment().format("YYYY-MM-DD")
			var stack = req.body.stack;

			db.get('projects')
				.push(req.body)
				.last()
				.assign({
					id: Date.now().toString(),
					name: name,
					image: image,
					description: description,
					fecha: date,
					stack: stack,
					estado: "1"
				})
				.write()
				.then(project => res.send(project))
		})

		// GET /project/:id - Show project by ID
		app.get('/api/project/:id', loadProject, (req, res) => {
			const project = db.get('projects')
				.find({
					id: req.params.id
				})
				.value()
			res.send(project)
		})

		// POST /project/:id - Update Project
		app.post('/api/project', (req, res) => {
			var project_id = req.body.id;
			var name = req.body.name;
			var image = req.body.image;
			var description = req.body.description;
			var stack = req.body.stack;

			const project = db.get('projects')
				.find({
					id: project_id
				})
				.assign({
					name: name,
					image: image,
					description: description,
					stack: stack
				})
				.write()

                res.statusCode = 200;
                return res.json({
                    message: 'Proyecto actualizado correctamente'
                });
		})

		// GET /project/remove/:id - change status to project
		app.get('/api/project/remove/:id', loadProject, (req, res) => {
			var project_id = req.params.id;

			const project = db.get('projects')
				.find({
					id: project_id
				})
				.assign({
					estado: "2"
				})
				.write()

			res.statusCode = 200;
			return res.json({
				message: 'Proyecto dado de baja correctamente'
			});

		})

		// GET /project/remove/:id - delete project from db
		app.get('/api/project/erase/:id', loadProject, (req, res) => {
			var project_id = req.params.id;
			const project = db.get('projects')
				.remove({
					id: project_id
				})
				.write()

			res.statusCode = 200;
			return res.json({
				message: 'Proyecto Eliminado Correctamente'
			});

		})

		function loadProject(req, res, next) {
			var project_id = req.params.id;
			const project = db.get('projects')
				.find({
					id: req.params.id
				})
				.value()

			if (project) { //if project found

				next();

			} else {
				res.statusCode = 404;
				return res.json({
					errors: ['Error - Proyecto no encontrado']
				});
			}
		}

		// Set db default values
		return db.defaults({
			projects: []
		}).write()
	})
	.then(() => {
		app.listen(3000, () => console.log('listening on port 3000'))
	})
