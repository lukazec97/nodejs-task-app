const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send()
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const query = req?.query
        const match = {}
        if (query?.completed) {
            match.completed = query?.completed === 'true'
        }
        const sort = {}
        if (query?.sortBy) {
            const parts = query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        await req.user.populate({ 
            path: 'tasks',
            match,
            options: {
                limit: parseInt(query?.limit),
                skip: parseInt(query?.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const taskId = req?.params?.id;
    try {
        const task = await Task.findOne({ _id: taskId, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(404).send()
    }
})
router.patch('/tasks/:id', auth, async (req, res) => {
    const taskId = req?.params?.id;

    const updates = Object.keys(req?.body)
    const allowedUpdates = ['description', 'completed']
    const isAllowedUpdate = updates.every((item) => allowedUpdates.includes(item))

    if (!isAllowedUpdate) {
        return res.status(400).send({ error: 'Invalid field is set for update' })
    }

    try {
        const task = await Task.findOne({ _id: taskId, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req?.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req?.params?.id
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router