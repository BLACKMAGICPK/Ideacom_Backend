const mongoose = require('mongoose');

const psSchema = new mongoose.Schema({
  ps_id: String,
  ps_title: String,
  objective: String,
  background: String,
  industry_name: String,
  industry_logo: String,
  sdg1: String,
  sdg2: String
});

module.exports = mongoose.model('PS_ARVR', psSchema, 'PS_ARVR');
