require('dotenv').config()
const mongoose = require('mongoose')
const prompt = require('prompt-sync')();

//MODELS
const Customer = require('./models/customer')

//Query Functions
const runQueries = async () => {
    console.log('Welcome to the CRM.')
    
    while (true) {
        console.log("What would you like to do?\n");
        console.log("  1. Create a customer");
        console.log("  2. View all customers");
        console.log("  3. Update a customer");
        console.log("  4. Delete a customer");
        console.log("  5. Quit\n"); 

        const choice = prompt("Number of action to run: "); 

        switch (choice) {
            case '1':
                await createCustomer();
                break;
            case '2':
                await viewCustomers();
                break;
            case '3':
                await updateCustomer();
                break;
            case '4':
                await deleteCustomer();
                break;
            case '5':
                console.log("Exiting the Application\n"); 
                return;
            default:
                console.log("Invalid choice. Please try again.\n");
        }
    }
}

const createCustomer = async () => {
    const name = prompt("Enter customer name: ");
    const age = parseInt(prompt("Enter customer age: ")); 

    try {
        const newCustomer = new Customer({ name, age });
        await newCustomer.save();
        console.log("Customer created successfully!");
    } catch (error) {
        console.error("Error creating customer:", error);
    }
};

const viewCustomers = async () => {
    try {
        const customers = await Customer.find();
        if (customers.length === 0) {
            console.log("No customers found.\n"); 
            return;
        }

        console.log("\nCustomers:"); 
        customers.forEach(customer => {
            console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`); 
        });
        console.log("\n"); 
    } catch (error) {
        console.error("Error viewing customers:", error);
    }
};

const updateCustomer = async () => {
    try {
        const customers = await Customer.find();
        if (customers.length === 0) {
            console.log("No customers found to update.\n");
            return;
        }
        console.log("Updating a customer\n");
        console.log("Below is a list of customers:"); 
        customers.forEach(customer => {
            console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`); 
        });
        console.log("\n");
        const idToUpdate = prompt("Copy and paste the id of the customer you would like to update here: "); 
        console.log("\n");
        const newName = prompt("What is the customers new name? "); 
        const newAgeStr = prompt("What is the customers new age? ");
        console.log("\n");

        let updateData = {};
        if (newName) updateData.name = newName;
        if (newAgeStr) {
            const newAge = parseInt(newAgeStr);
            if (!isNaN(newAge)) updateData.age = newAge;
            else console.log("Invalid age entered. Keeping current age.")
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(idToUpdate, updateData, { new: true }); 
        if (!updatedCustomer) {
            console.log("Customer with that ID not found.\n");
        } else {
            console.log("Customer updated successfully!\n");
        }

    } catch (error) {
        console.error("Error updating customer:", error);
    }
};

const deleteCustomer = async () => {
    try {
        const customers = await Customer.find();
        if (customers.length === 0) {
            console.log("No customers found to delete.");
            return;
        }

        console.log("\nCustomers:");
        customers.forEach(customer => {
            console.log(`ID: ${customer._id}, Name: ${customer.name}, Age: ${customer.age}`);
        });

        const idToDelete = prompt("Enter the ID of the customer to delete: ");
        await Customer.findByIdAndDelete(idToDelete);
        console.log("Customer deleted successfully!");
    } catch (error) {
        console.error("Error deleting customer:", error);
    }
};

//CONNECT
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await runQueries();

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }

    process.exit();
}

connect();
