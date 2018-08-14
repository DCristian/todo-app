require('./config/config');
require('./db/mangoose');

const express = require('express');
const bodyParser = require('body-parser');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const {Todo} = require('./models/todo');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.route('/todos')
    .get((req, res) => {
        Todo.find().then((todos) => {
            res.send({todos});
        }, (e) => {
            res.status(400).send(e);
        });
    })
    .post((req, res) => {
        let todo = new Todo({
            text: req.body.text
        });

        todo.save().then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
    });

app.route('/todos/:id')
    .get((req, res) => {
        const id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        Todo.findById(id)
            .then((todo) => {
                if (!todo) {
                    return res.status(404).send();
                }

                res.send(todo);
            }).catch((e) => {
            res.status(400).send();
        });
    })
    .patch((req, res) => {
        const id = req.params.id;
        let body = _.pick(req.body, ['text', 'completed']);

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        let completed = false;
        body.completedAt = null;

        if (_.isBoolean(body.completed) && body.completed) {
            completed = body.completed;
            body.completedAt = new Date().getTime();
        }

        body.completed = completed;

        Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({todo});
        });
    })
    .delete((req, res) => {
        const id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        Todo.findByIdAndRemove(id)
            .then((todo) => {
                if (!todo) {
                    return res.status(404).send();
                }

                res.send(todo);
            }).catch((e) => {
            res.status(400).send();
        });
    });

app.listen(port, () => {
   console.log(`Started on port ${port}.`);
});

module.exports = {app};
