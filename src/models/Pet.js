const mongoose = require('mongoose');
const { Schema } = mongoose;

const PetSchema = new Schema({
    name: { type: String, required: true },
    race: { type: String, required: true },
    birthdate: { type: Date, required: true },
    gender: { type: String },
    color: { type: String },
    vaccinated: { type: Boolean },
    castrated: { type: Boolean },
    aggressive: { type: Boolean },
    owner_id: { type:  String }
});

module.exports = mongoose.model('Pet', PetSchema);