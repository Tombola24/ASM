const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const sql = require('mssql');
const {poolPromise } = require('./dbconfig');
const bcrypt = require('bcrypt');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle file upload and processing
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Parse the Excel file
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const pool = await poolPromise;
        const request = pool.request();

        await request.query('BEGIN TRANSACTION');

        for (const asset of jsonData) {
            await request
                .input('AssetID', sql.NVarChar, asset.AssetID)  
                .input('Name', sql.NVarChar, asset.Name)  
                .input('Category', sql.NVarChar, asset.Category)
                .input('PurchaseDate', sql.Date, asset.PurchaseDate)
                .input('Cost', sql.Decimal(18, 2), asset.Cost)
                .input('CurrentValue', sql.Decimal(18, 2), asset.CurrentValue || null)  
                .input('Location', sql.NVarChar, asset.Location)
                .input('Department', sql.NVarChar, asset.Department)
                .input('Condition', sql.NVarChar, asset.Condition)
                .input('Status', sql.NVarChar, asset.Status)
                .input('MaintenanceSchedule', sql.Date, asset.MaintenanceSchedule || null)  
                .input('WarrantyInformation', sql.NVarChar, asset.WarrantyInformation || null)  
                .input('SupplierInformation', sql.NVarChar, asset.SupplierInformation || null)  
                .input('Notes', sql.NVarChar, asset.Notes || null) 
                .query(`INSERT INTO Assets (AssetID, Name, Category, PurchaseDate, Cost, CurrentValue, Location, Department, Condition, Status, MaintenanceSchedule, WarrantyInformation, SupplierInformation, Notes) 
                        VALUES (@AssetID, @Name, @Category, @PurchaseDate, @Cost, @CurrentValue, @Location, @Department, @Condition, @Status, @MaintenanceSchedule, @WarrantyInformation, @SupplierInformation, @Notes)`);
        }

        await request.query('COMMIT TRANSACTION');

        res.json({ message: 'File uploaded and processed successfully', rowCount: jsonData.length });
    } catch (error) {
        console.error('Error processing upload:', error);
        try {
            await pool.request().query('ROLLBACK TRANSACTION');
        } catch (rollbackError) {
            console.error('Error rolling back transaction:', rollbackError);
        }
        res.status(500).json({ error: 'An error occurred while processing the file' });
    }
});


// Get all assets
router.get('/assets', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Assets');
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server Error');
    }
});

// Get a specific asset by ID
router.get('/assets/:id', async (req, res) => {
    const assetId = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('AssetID', sql.NVarChar, assetId)
            .query('SELECT * FROM Assets WHERE AssetID = @AssetID');
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Asset not found');
        }
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server Error');
    }
});

// Save a new asset
router.post('/assets', async (req, res) => {
    const asset = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('AssetID', sql.NVarChar, asset.AssetID)  
            .input('Name', sql.NVarChar, asset.Name)  
            .input('Category', sql.NVarChar, asset.Category)
            .input('PurchaseDate', sql.Date, asset.PurchaseDate)
            .input('Cost', sql.Decimal(18, 2), asset.Cost)
            .input('CurrentValue', sql.Decimal(18, 2), asset.CurrentValue || null)  
            .input('Location', sql.NVarChar, asset.Location)
            .input('Department', sql.NVarChar, asset.Department)
            .input('Condition', sql.NVarChar, asset.Condition)
            .input('Status', sql.NVarChar, asset.Status)
            .input('MaintenanceSchedule', sql.Date, asset.MaintenanceSchedule || null)  
            .input('WarrantyInformation', sql.NVarChar, asset.WarrantyInformation || null)  
            .input('SupplierInformation', sql.NVarChar, asset.SupplierInformation || null)  
            .input('Notes', sql.NVarChar, asset.Notes || null) 
            .query(`INSERT INTO Assets (AssetID, Name, Category, PurchaseDate, Cost, CurrentValue, Location, Department, Condition, Status, MaintenanceSchedule, WarrantyInformation, SupplierInformation, Notes) 
                    VALUES (@AssetID, @Name, @Category, @PurchaseDate, @Cost, @CurrentValue, @Location, @Department, @Condition, @Status, @MaintenanceSchedule, @WarrantyInformation, @SupplierInformation, @Notes)`);
        res.status(201).json({ message: 'Asset saved successfully!' });
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server Error');
    }
});

// Update an asset
router.put('/assets/:id', async (req, res) => {
    const assetId = req.params.id;
    const asset = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('AssetID', sql.NVarChar, assetId)
            .input('Name', sql.NVarChar, asset.Name)  
            .input('Category', sql.NVarChar, asset.Category)
            .input('PurchaseDate', sql.Date, asset.PurchaseDate)
            .input('Cost', sql.Decimal(18, 2), asset.Cost)
            .input('CurrentValue', sql.Decimal(18, 2), asset.CurrentValue || null)  
            .input('Location', sql.NVarChar, asset.Location)
            .input('Department', sql.NVarChar, asset.Department)
            .input('Condition', sql.NVarChar, asset.Condition)
            .input('Status', sql.NVarChar, asset.Status)
            .input('MaintenanceSchedule', sql.Date, asset.MaintenanceSchedule || null)  
            .input('WarrantyInformation', sql.NVarChar, asset.WarrantyInformation || null)  
            .input('SupplierInformation', sql.NVarChar, asset.SupplierInformation || null)  
            .input('Notes', sql.NVarChar, asset.Notes || null) 
            .query(`UPDATE Assets 
                    SET Name = @Name, Category = @Category, PurchaseDate = @PurchaseDate, Cost = @Cost, CurrentValue = @CurrentValue, 
                        Location = @Location, Department = @Department, Condition = @Condition, Status = @Status, 
                        MaintenanceSchedule = @MaintenanceSchedule, WarrantyInformation = @WarrantyInformation, 
                        SupplierInformation = @SupplierInformation, Notes = @Notes
                    WHERE AssetID = @AssetID`);
        res.json({ message: 'Asset updated successfully!' });
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server Error');
    }
});

// Delete an asset
router.delete('/assets/:id', async (req, res) => {
    const assetId = req.params.id;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('AssetID', sql.NVarChar, assetId)
            .query('DELETE FROM Assets WHERE AssetID = @AssetID');
        res.json({ message: 'Asset deleted successfully!' });
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server Error');
    }
});

// Generate a report
router.get('/report', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Assets');
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server Error');
    }
});

//register user
router.post('/register', async (req, res) => {
    const { username, email, password, firstName, lastName} = req.body;

    console.log('Received data:', { username, email, password, firstName, lastName });

    try {
  
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const pool = await poolPromise;

        await pool.request()
            .input('Username', sql.NVarChar, username)
            .input('Email', sql.NVarChar, email)
            .input('PasswordHash', sql.NVarChar, hashedPassword)
            .input('Firstname', sql.NVarChar, firstName)
            .input('Lastname', sql.NVarChar, lastName)
            .query(`INSERT INTO Users (Username, Email, PasswordHash, Firstname, Lastname)
                    VALUES (@Username, @Email, @PasswordHash, @Firstname, @Lastname)`);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server Error');
    }
});

//login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('Username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @Username');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

            if (passwordMatch) {
                // You can set up a session here or return user info/token
                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An internal error occurred. Please try again later.' });
    }
});

module.exports = router;