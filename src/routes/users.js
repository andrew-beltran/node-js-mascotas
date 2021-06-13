const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { isAuthenticated } = require('../helpers/auth');

const passport = require('passport');

const REGEX_USERNAME = /^[A-z._-]{4,24}$/;
const REGEX_PASSWORD = /^(?=.*\d)(?=.*[\w])([^\s]){8,16}$/;
const REGEX_EMAIL = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
const REGEX_PHONE = /^\d{1}[\-\ ]{0,1}\d{1}[\-\ ]{0,1}\d{1}[\-\ ]{0,1}\d{1}[\-\ ]{0,1}\d{1}[\-\ ]{0,1}\d{1}[\-\ ]{0,1}\d{1}[\-\ ]{0,1}\d{1}[\-\ ]{0,1}\d{1}$/;

router.get('/users/singin', (req, res) => {
    res.render('users/singin');
});

router.get('/users/singup', (req, res) => {
    res.render('users/singup');
});

router.get('/users/config', isAuthenticated, (req, res) => {
    const { username, email, phone } = req.user;
    res.render('users/config', { username, email, phone });
});

router.put('/users/config', isAuthenticated, async (req, res) => {
    const { username, email, confirm_password} = req.body;
    let { phone, password } = req.body;
    const errors = [];
    const success = [];
    if (req.user.username != username){
        if (!REGEX_USERNAME.test(username)) {
            errors.push({text: 'nombre no válido.'});
        } else {
            await User.findByIdAndUpdate(req.user.id, { username });
            success.push({text: 'Nombre actualizado correctamente'});
        }
    }
    if (req.user.email != email) {
        if (!REGEX_EMAIL.test(email)) {
            errors.push({text: 'Email erroneo, introduzca un email válido.'});
        } else {
            const emailUser = await User.findOne({email: email});
            if(emailUser) {
                errors.push({text: 'Este email ya está en uso.'});
            } else {
                await User.findByIdAndUpdate(req.user.id, { email });
                success.push({text: 'Email actualizado correctamente'});
            }
        }
    }
    if (req.user.phone != phoneFormat(phone)) {
        if (!REGEX_PHONE.test(phone)) {
            errors.push({text: 'Número de teléfono no válido.'});
        } else {
            phone = phoneFormat(phone);
            await User.findByIdAndUpdate(req.user.id, { phone });
            success.push({text: 'Teléfono actualizado correctamente'});
        }
    }
    if (password != '') {
        if (password != confirm_password) {
            errors.push({text: 'La contraseña no coincide.'});
        } else if (!REGEX_PASSWORD.test(password)) {
            errors.push({text: 'La contraseña no cumple con los requisitos.'});
        } else {
            password = await req.user.encryptPassword(password);
            await User.findByIdAndUpdate(req.user.id, { password });
            success.push({text: 'Contraseña actualizada correctamente'});
        }
    }
    
    res.render('users/config', { errors, success, username, email, phone });
    
});

router.post('/users/singin', passport.authenticate('local', {
    successRedirect: '/pets',
    failureRedirect: '/users/singin',
    failureFlash: true
}));

router.post('/users/singup', async (req, res) => {
    const { username, email, password, confirm_password} = req.body;
    let phone = req.body.phone;
    let savedPhone = phone;

    const errors = [];
    if (!REGEX_USERNAME.test(username)) {
        errors.push({text: 'nombre no válido.'});
    }
    if (password != confirm_password) {
        errors.push({text: 'La contraseña no coincide.'});
    } else if (!REGEX_PASSWORD.test(password)) {
        errors.push({text: 'La contraseña no cumple con los requisitos.'});
    }
    if (!REGEX_EMAIL.test(email)) {
        errors.push({text: 'Email erroneo, introduzca un email válido.'});
    } else {
        const emailUser = await User.findOne({email: email});
        if(emailUser) {
            errors.push({text: 'Este email ya está en uso.'});
        }
    }
    if (phone) {
        if (!REGEX_PHONE.test(phone)) {
            errors.push({text: 'Número de teléfono no válido.'});
        } else {
            phone = phoneFormat(phone);
        }
    }
    if (errors.length > 0) {
        res.render('users/singup', {errors, username, email, savedPhone, password, confirm_password});
    } else {
        const newUser = new User({username, email, phone, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Te has registrado correctamente');
        res.redirect('/users/singin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

function phoneFormat(phone) {
    return phone.split(/[\-\ ]/g).join('').match(/.{1,3}/g).join(' ');
}

module.exports = router;