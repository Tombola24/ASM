function navigateToFilteringPage() {
    window.location.href = 'filteringpage.html';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function searchAsset() {
    const assetId = document.getElementById('searchId').value;
    try {
        const response = await fetch(`/api/assets/${assetId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const asset = await response.json();

        if (asset) {
            const deleteSection = document.getElementById('deleteSection');
            const assetDetails = document.getElementById('assetDetails');

            if (deleteSection) {
                deleteSection.style.display = 'block';
            }
            if (assetDetails) {
                assetDetails.innerHTML = `
                    <p><strong>Asset ID:</strong> ${asset.AssetID}</p>
                    <p><strong>Asset Name:</strong> ${asset.Name}</p>
                    <p><strong>Category:</strong> ${asset.Category}</p>
                    <p><strong>Purchase Date:</strong> ${formatDate(asset.PurchaseDate)}</p>
                    <p><strong>Cost:</strong> ${asset.Cost}</p>
                    <p><strong>Current Value:</strong> ${asset.CurrentValue}</p>
                    <p><strong>Location:</strong> ${asset.Location}</p>
                    <p><strong>Department:</strong> ${asset.Department}</p>
                    <p><strong>Condition:</strong> ${asset.Condition}</p>
                    <p><strong>Status:</strong> ${asset.Status}</p>
                    <p><strong>Maintenance Schedule:</strong> ${formatDate(asset.MaintenanceSchedule)}</p>
                    <p><strong>Warranty Information:</strong> ${asset.WarrantyInformation}</p>
                    <p><strong>Supplier Information:</strong> ${asset.SupplierInformation}</p>
                    <p><strong>Notes:</strong> ${asset.Notes}</p>
                `;
                populateForm(asset);
            }
        } else {
            alert('Asset not found.');
        }
    } catch (error) {
        console.error('Error fetching asset:', error);
        alert('Error fetching asset details. Please try again later.');
    }
}

async function deleteAsset() {
    const assetId = document.getElementById('searchId').value;
    try {
        const response = await fetch(`/api/assets/${assetId}`, { method: 'DELETE' });
        if (response.ok) {
            document.getElementById('message').innerText = 'Asset deleted successfully.';
            document.getElementById('message').style.display = 'block';
            document.getElementById('assetDetails').innerHTML = '';
            document.getElementById('deleteSection').style.display = 'none';
        } else {
            throw new Error('Failed to delete asset.');
        }
    } catch (error) {
        console.error('Error deleting asset:', error);
        alert('Error deleting asset. Please try again later.');
    }
}

function populateForm(asset) {
    const formContainer = document.querySelector('#assetForm .form-container');
    formContainer.innerHTML = `
        <div class="form-group">
            <label for="assetId">Asset ID:</label>
            <input type="text" id="assetId" name="assetId" value="${asset.AssetID}" readonly>
        </div>
        <div class="form-group">
            <label for="assetName">Asset Name:</label>
            <input type="text" id="assetName" name="assetName" value="${asset.Name}" required>
        </div>
        <div class="form-group">
            <label for="category">Category:</label>
            <input type="text" id="category" name="category" value="${asset.Category}">
        </div>
        <div class="form-group">
            <label for="purchaseDate">Purchase Date:</label>
            <input type="date" id="purchaseDate" name="purchaseDate" value="${formatDate(asset.PurchaseDate)}">
        </div>
        <div class="form-group">
            <label for="cost">Cost:</label>
            <input type="number" id="cost" name="cost" value="${asset.Cost}">
        </div>
        <div class="form-group">
            <label for="currentValue">Current Value:</label>
            <input type="number" id="currentValue" name="currentValue" value="${asset.CurrentValue}">
        </div>
        <div class="form-group">
            <label for="location">Location:</label>
            <input type="text" id="location" name="location" value="${asset.Location}">
        </div>
        <div class="form-group">
            <label for="department">Department:</label>
            <input type="text" id="department" name="department" value="${asset.Department}">
        </div>
        <div class="form-group">
            <label for="condition">Condition:</label>
            <input type="text" id="condition" name="condition" value="${asset.Condition}">
        </div>
        <div class="form-group">
            <label for="status">Status:</label>
            <input type="text" id="status" name="status" value="${asset.Status}">
        </div>
        <div class="form-group">
            <label for="maintenanceSchedule">Maintenance Schedule:</label>
            <input type="date" id="maintenanceSchedule" name="maintenanceSchedule" value="${formatDate(asset.MaintenanceSchedule)}">
        </div>
        <div class="form-group">
            <label for="warrantyInfo">Warranty Information:</label>
            <textarea id="warrantyInfo" name="warrantyInfo">${asset.WarrantyInformation}</textarea>
        </div>
        <div class="form-group">
            <label for="supplierInfo">Supplier Information:</label>
            <textarea id="supplierInfo" name="supplierInfo">${asset.SupplierInformation}</textarea>
        </div>
        <div class="form-group">
            <label for="notes">Notes:</label>
            <textarea id="notes" name="notes">${asset.Notes}</textarea>
        </div>
    `;
}

async function updateAsset(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('assetForm'));
    const data = Object.fromEntries(formData);

    try {
        await fetch(`/api/assets/${data.assetId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                AssetID: data.assetId,
                Name: data.assetName,
                Category: data.category,
                PurchaseDate: data.purchaseDate,
                Cost: data.cost,
                CurrentValue: data.currentValue,
                Location: data.location,
                Department: data.department,
                Condition: data.condition,
                Status: data.status,
                MaintenanceSchedule: data.maintenanceSchedule,
                WarrantyInformation: data.warrantyInfo,
                SupplierInformation: data.supplierInfo,
                Notes: data.notes
            })
        });

        document.getElementById('message').innerText = 'Asset saved successfully.';
        document.getElementById('message').style.display = 'block';
    } catch (error) {
        console.error('Error updating asset:', error);
        alert('Error updating asset. Please try again later.');
    }
}

async function saveAsset(event) {
    event.preventDefault();

    const asset = {
        AssetID: document.getElementById('assetId').value,
        Name: document.getElementById('assetName').value,
        Category: document.getElementById('category').value,
        PurchaseDate: document.getElementById('purchaseDate').value,
        Cost: document.getElementById('cost').value,
        CurrentValue: document.getElementById('currentValue').value,
        Location: document.getElementById('location').value,
        Department: document.getElementById('department').value,
        Condition: document.getElementById('condition').value,
        Status: document.getElementById('status').value,
        MaintenanceSchedule: document.getElementById('maintenanceSchedule').value,
        WarrantyInformation: document.getElementById('warrantyInfo').value,
        SupplierInformation: document.getElementById('supplierInfo').value,
        Notes: document.getElementById('notes').value
    };

    try {
        const response = await fetch('/api/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asset)
        });

        if (response.ok) {
            alert('Asset saved successfully!');
            document.getElementById('assetForm').reset();
        } else {
            alert('Failed to save asset.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error saving asset.');
    }
}

function downloadReport() {
    const table = document.getElementById('reportTable');
    const rows = Array.from(table.rows);
    const csvContent = rows.map(row => Array.from(row.cells).map(cell => cell.innerText).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'report.csv';
    link.click();
}

function uploadExcel(event) {
    event.preventDefault();  // Prevent the default form submission

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);  

        // Send the data to the server
        fetch('http://localhost:8085/api/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            document.getElementById('statusMessage').textContent = 'File uploaded successfully!';
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('statusMessage').textContent = 'An error occurred while uploading the file.';
        });
    } else {
        alert('Please select a file to upload.');
    }
}

// Register new user
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById('registrationMessage').innerText = 'User registered successfully!';
            this.reset(); // Reset the form
        } else {
            const result = await response.json();
            document.getElementById('registrationMessage').innerText = result.error || 'Registration failed.';
        }
    } catch (err) {
        console.error('Error registering user:', err);
        document.getElementById('registrationMessage').innerText = 'An error occurred. Please try again later.';
    }
});

