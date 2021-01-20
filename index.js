const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const app = express()
const mongoose = require('mongoose')
const Product = require('./models/products')
const bodyparser = require('body-parser')
mongoose.connect('mongodb://localhost:27017/e-products',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const db = mongoose.connection;
db.on("error" , console.error.bind(console , "Connection error: "));
db.once("open" , ()=>{
    console.log("connection established")
})

app.use(bodyparser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));
app.use('/styles', express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/public'));
app.set('views' , path.join(__dirname , 'views'))
app.set('view engine' , 'ejs')
app.get('/home' , (req , res)=>{
    res.render('e-commerce/home')
})

app.get('/signup' , (req , res)=>{
    res.render('e-commerce/signup')
})
app.get('/signin' , (req , res)=>{
    res.render('e-commerce/signin')
})

app.get('/products' , async (req , res)=>{
    const allproducts = await Product.find({})
    let categories = await Product.find({}).select('category -_id')
    let uniqecat = []
    for(let category of categories)
    {
        uniqecat.push(category.category)
    }
    uniqecat = [...new Set(uniqecat)]
    res.render('e-commerce/products/products' , {allproducts,uniqecat})
})


app.get('/products/:id' , async (req , res)=>{
    const {id} = req.params
    const foundproduct = await Product.findById(id)
    res.render('e-commerce/products/show' , {foundproduct})
})

app.get('/products/:id/edit' , async (req , res)=>{
    const {id} = req.params
    const foundproduct = await Product.findById(id)
    res.render('e-commerce/products/edit' , {foundproduct})
})

app.put('/products/:id' , async (req , res)=>{
    const {id} = req.params
    const updatedproduct = await Product.findByIdAndUpdate(id , req.body , {runValidators: true})
    res.redirect(`/products/${id}`)
})

const port = 5050
app.listen(5050 , () => {
    console.log(`Listening on Port No. ${port}`)
})

