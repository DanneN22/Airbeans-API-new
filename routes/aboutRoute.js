import { Router } from 'express'
import { showAbout } from '../services/about.js'

const router = Router()

router.get('/', async(req,res) => {
    const about = await showAbout()
    res.json({about : about})
})


export default router

     