const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Human_Resource', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define a schema for the employee collection
const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  salary: Number,
  department: String,
  lastCompany: String,
  lastSalary: Number,
  overallExp: Number,
  contactInfo: String,
  yearGrad: Number,
  gradStream: String
});

// Define a model based on the schema
const Employee = mongoose.model('Employee', employeeSchema);

// Connect to MongoDB
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');

  // Create index on the 'salary' field
  Employee.collection.createIndex({ "salary": 1 }, function(err, result) {
    if (err) throw err;
    console.log('Index created on salary field');

    // Find employees with salary more than 30000
    Employee.find({ "salary": { $gt: 30000 } }, function(err, highSalaryEmployees) {
      if (err) throw err;
      console.log('Employees with salary more than 30000:', highSalaryEmployees);

      // Update salary of employees with salary greater than 70000 to 65000
      Employee.updateMany({ "salary": { $gt: 70000 } }, { $set: { "salary": 65000 } }, function(err, res) {
        if (err) throw err;
        console.log('Salaries updated for employees with salary greater than 70000');

        // Delete documents where last company is Y
        Employee.deleteMany({ "lastCompany": "Y" }, function(err, result) {
          if (err) throw err;
          console.log('Documents where last company is Y deleted');

          // Close the connection
          mongoose.connection.close();
        });
      });
    });
  });
});
