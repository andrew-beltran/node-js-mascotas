const express = require('express');
const router = express.Router();

const Pet = require('../models/Pet');
const { isAuthenticated } = require('../helpers/auth');

const STRING_MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                    "Julio", "Agosto", "Septiembre", "Octubre", "Nobiembre", "Diciembre"];
const REGEX_TEXT = /^[A-z\ ]{4,24}$/;
const REGEX_DATE = /^\d{4}-\d{2}-\d{2}$/;

router.get('/pets/add', isAuthenticated, (req, res) => {
    res.render('pets/new-pet');
});
// REDIRECCIONES

//ir a TODAS LAS MASCOTAS
router.get('/pets', async (req, res) => {
    const pets = await Pet.find().lean();
    res.render('pets/all-pets', {pets});
    
});
// ir a MIS MASCOTAS
router.get('/pets/mypets', isAuthenticated, async (req, res) => {
    const pets = await Pet.find().lean();
    res.render('pets/my-pets', {pets});
});
// ir a EDITAR
router.get('/pets/mypets/edit/:id', isAuthenticated, async (req, res) => {
    const pet = await Pet.findById(req.params.id).lean();
    let birthdate = formatDate(pet.birthdate);
    res.render('pets/edit-pet', { pet, birthdate });
});
// ir a AÑADIR
router.get('/pets/mypets/add', isAuthenticated, async (req, res) => {
    res.render('pets/new-pet');
});

// MODIFICACIONES

// ADOPTAR
router.get('/pets/adopt/:id', isAuthenticated, async (req, res) => {
    const owner_id = req.user.id;
    await Pet.findByIdAndUpdate(req.params.id, { owner_id });
    req.flash('success_msg', 'Mascota adoptada correctamente');
    res.redirect('/pets');
});
// VACUNAR
router.get('/pets/mypets/vaccinate/:id', isAuthenticated, async (req, res) => {
    const vaccinated = true;
    await Pet.findByIdAndUpdate(req.params.id, { vaccinated });
    req.flash('success_msg', 'Se ha vacunado a su mascota satisfactoriamente');
    res.redirect('/pets/mypets/edit/' + req.params.id);
});
// CASTRAR
router.get('/pets/mypets/castrate/:id', isAuthenticated, async (req, res) => {
    const castrated = true;
    await Pet.findByIdAndUpdate(req.params.id, { castrated });
    req.flash('success_msg', 'Se ha castrado a su mascota satisfactoriamente');
    res.redirect('/pets/mypets/edit/' + req.params.id);
});

// RENOMBRAR
router.put('/pets/mypets/rename/:id', isAuthenticated, async (req, res) => {
    const { name, controlname } = req.body;
    if ( name != controlname) {
        if (REGEX_TEXT.test(name)) {
            await Pet.findByIdAndUpdate(req.params.id, { name });
            req.flash('success_msg', 'Nombre Actualizado correctamente');
        } else {
            req.flash('error', 'El nombre introducido no es válido');
        }
    }
    res.redirect('/pets/mypets/edit/' + req.params.id);
});

// ABANDONO
router.get('/pets/mypets/leave/:id', isAuthenticated, async (req, res) => {
    const owner_id = null;
    await Pet.findByIdAndUpdate(req.params.id, { owner_id });
    req.flash('success_msg', 'Mascota abandonada correctamente');
    res.redirect('/pets/mypets');
});
// SACRIFICIO
router.get('/pets/mypets/sacrifice/:id', isAuthenticated, async (req, res) => {
    await Pet.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Mascota sacrificada correctamente, es usted un monstruo :D');
    res.redirect('/pets/mypets');
});

// AÑADIR
router.post('/pets/mypets/add', isAuthenticated, async (req, res) => {
    let { name, race, birthdate, gender, color, vaccinated, castrated, aggressive } = req.body;
    /*  
        se usa esto por que estos valores se meten a travez de un checkbox, si está marcado 
        devuelve un string con valor "on", si no es igual a undefined.
    */
    vaccinated = vaccinated == undefined ? false : true;
    castrated = castrated == undefined ? false : true;
    aggressive = aggressive == undefined ? false : true;
    
    const errors = [];
    if (!name) {
        errors.push({text: 'Introduce un nombre a tu criatura'});
    } else if (!REGEX_TEXT.test(name)) {
        errors.push({text: 'El nombre introducido no es válido'});
    }
    if (!race) {
        errors.push({text: 'Indica la especie'});
    } else if (!REGEX_TEXT.test(race)) {
        errors.push({text: 'La especie introducida no es válida'});
    }
    if (!birthdate) {
        errors.push({text: 'Indique la fecha de nacimiento'});
    } else if (!validateDate(birthdate) || new Date(birthdate) > (new Date())) {
        errors.push({text: 'Indique una fecha válida'});
    }
    if (gender) {
        if (!REGEX_TEXT.test(gender)) {
            errors.push({text: 'El género introducido no es válido'});
        }
    }
    if (color) {
        if (!REGEX_TEXT.test(color)) {
            errors.push({text: 'El color introducido no es válido'});
        }
    }
    
    if (errors.length > 0) {
        res.render('pets/new-pet', { errors, name, race, birthdate });
    } else {
        const newPet = new Pet({ name, race, birthdate, gender, color, vaccinated, castrated, aggressive });
        newPet.owner_id = req.user.id;
        await newPet.save();
        req.flash('success_msg', 'Mascota añadida correctamente a su nombre');
        res.redirect('/pets/mypets');
    }
});

module.exports = router;

function formatDate(date) {
    let day;
    let month;
    let year;
    if (date instanceof Date) {
        day = date.getDate();
        month = date.getMonth();
        year = date.getFullYear();
    } else {
        // esto es un parche feo no me lo tengas mucho en cuenta xd
        // es para que acepte las fechas de los datos de la colección con 
        // un string en la fecha con el formato "21-01-2021"
        dated = date.split('-');
        day = parseInt(dated[0]);
        month = parseInt(dated[1]) - 1;
        year = parseInt(dated[2]);
    }
    return day + " de " + STRING_MONTHS[month] + " de " + year;
}

function validateDate(date) {
    if(!REGEX_DATE.test(date)) {
        return false;
    }
    let dateSplit = date.split('-');
    let year = parseInt(dateSplit[0]);
    let month = parseInt(dateSplit[1]);
    let day = parseInt(dateSplit[2]);

    if (month < 1 || 12 < month) {
        return false;
    }

    let daysMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        daysMonth[1] = 29;
    }

    if (0 < day && day <= daysMonth[month - 1]) {
        return true;
    } else {
        return false;
    }
}