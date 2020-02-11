var express = require('express');
var router = express.Router();
const { Vault } = require('ansible-vault');

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(400).json({
    'status': 'fail',
    'msg': 'Please specify all the parameters! The required parameters are: passphrase, content and action (encrypt or decrypt)'
  });
});

router.post('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const v = new Vault({ password: req.body.passphrase });
  if (!req.body.passphrase || req.body.passphrase == '' || !req.body.content || req.body.content == '') {
    res.status(200).json({
      'status': 'fail',
      'msg': 'Please specify all the parameters! The required parameters are: passphrase, content and action (encrypt or decrypt)'
    });
  }
  else if (req.body.action == 'encrypt') {
    v.encrypt(req.body.content).then(function(data){
      res.status(200).json({
        'result': data,
        'status': 'success',
        'msg': 'Your data was successfully encrypted!'
      });
    }).catch(function(err){
      res.status(200).json({
        'status': 'fail',
        'msg': err+''
      });
    })
  } else if (req.body.action == 'decrypt') {
    v.decrypt(req.body.content).then(function(data){
      res.status(200).json({
        'result': data,
        'status': 'success',
        'msg': 'Your data was successfully decrypted!'
      });
    }).catch(function(err){
      res.status(200).json({
        'status': 'fail',
        'msg': err+''
      });
    })
  } else {
    res.status(200).json({
      'status': 'fail',
      'msg': 'Please specify all the parameters! The required parameters are: passphrase, content and action (encrypt or decrypt)'
    });
  }
});

module.exports = router;
