const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

//route to departments endpoint
router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
      if(err){
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

//get dep by id
router.get('/department/:id', (req, res) =>{
    const sql = `SELECT * FROM departments WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
      if(err){
        res.status(400).json({ error: err.message});
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
  });


//delete route CRUD
router.delete('/department/:id', (req, res) => {
    const sql = `DELETE FROM departments WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
      if(err){
        res.status(400).json({ error: res.message });
        //checks if something was deledted
      } else if (!result.affectedRows){
        res.json({
          message: 'Department not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
  });

  module.exports = router;