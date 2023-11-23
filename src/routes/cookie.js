import express from 'express'
const router = express.Router()


router.get('/set',(req,res)=>{
    res.cookie('server','express').send('Aca estan los cookie set ')

})
router.get('/set1',(req,res)=>{
    res.cookie('server','express',
        {maxAge:1000})//en milisegundo 
    .send('otro set')
})
router.get('/get',(req,res)=>{
    console.log(req.cookies);
    res.send(req.cookies.server);
})

router.get('/clear',(req,res)=>{
    res.clearCookie('server').send('Elimiando cookie');
})
router.get('/cookieSign',(req,res)=>{
    res.cookie('signServer','Esta es una cookie firmada',{maxAge:1000,signed:true})
    .send('cookie firmada')
}); //


router.get('/',(req,res)=>{
    res.render('cookies')
})

router.post('/',(req,res)=>{
    const data = req.body;
    res.cookie('idCookie',data,{maxAge:10000}).send({status:"success",message:"cookie set"})
})

export { router }