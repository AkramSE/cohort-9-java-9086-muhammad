import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EditContact from './EditContact';
import ViewContact from './ViewContact';
import Swal from 'sweetalert2';

// 1. API Base URL set kar diya gaya hai
const API_BASE_URL = "https://contact-manager-api-production-0aa6.up.railway.app";

// 2. CSV Formula Injection se bachne ke liye helper function
const sanitizeForCSV = (value) => {
    if (!value) return "";
    const strValue = String(value);
    // Agar text =, +, -, ya @ se shuru ho, toh uske aage ' laga dein
    if (/^[=+\-@]/.test(strValue)) {
        return "'" + strValue;
    }
    return strValue;
};

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [viewingContact, setViewingContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadContacts(currentPage, pageSize, searchTerm); 
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [currentPage, pageSize, searchTerm]);

    const getAuthData = () => {
        const rawToken = localStorage.getItem("jwtToken");
        const rawUserId = localStorage.getItem("userId");
        const token = rawToken ? atob(rawToken) : "";
        const userId = rawUserId ? atob(rawUserId) : "";
        return { token, userId };
    };

    const loadContacts = async (page = 0, size = 5, keyword = "") => {
        try {
            const { token, userId } = getAuthData();
            const currentUserId = Number.parseInt(userId, 10);
            
            if (Number.isNaN(currentUserId)) {
                console.error("Invalid User ID");
                return;
            }

            // URL ko API_BASE_URL se replace kar diya
            const result = await axios.get(`${API_BASE_URL}/users/${currentUserId}/contacts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    page: page,
                    size: size,
                    ...(keyword && { keyword: keyword })
                }
            });

            setContacts(result.data.content);
            setTotalPages(result.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch data from the backend: ", error);
        }
    };

    const deleteContact = async (contactId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const { token, userId } = getAuthData();
                const parsedUserId = Number.parseInt(userId, 10);
                const safeContactId = Number.parseInt(contactId, 10);

                if (Number.isNaN(parsedUserId) || Number.isNaN(safeContactId)) {
                    throw new TypeError("Invalid ID for deletion");
                }

                // URL ko API_BASE_URL se replace kar diya
                await axios.delete(`${API_BASE_URL}/users/${parsedUserId}/contacts/${safeContactId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                loadContacts(currentPage, pageSize, searchTerm);
                Swal.fire('Deleted!', 'Your contact has been deleted.', 'success');
            } catch (error) {
                console.error("Error occurred during deletion:", error);
                Swal.fire('Error!', 'Something went wrong.', 'error');
            }
        }
    };

    const handleExport = async () => {
        try {
            const { token, userId } = getAuthData();
            const parsedUserId = Number.parseInt(userId, 10);

            if (Number.isNaN(parsedUserId)) {
                throw new TypeError("Invalid User ID for export");
            }
            
            // URL ko API_BASE_URL se replace kar diya
            const response = await axios.get(`${API_BASE_URL}/users/${parsedUserId}/contacts`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    page: 0,
                    size: 1000
                }
            });
            
            const allContacts = response.data.content;
            
            if (!allContacts || allContacts.length === 0) {
                Swal.fire('Info', 'No contacts available to export.', 'info');
                return;
            }

            let csvContent = "Title,First Name,Last Name,Email,Phone\n";
            
            allContacts.forEach(contact => {
                // Har value ko export hone se pehle sanitize kiya ja raha hai
                const title = sanitizeForCSV(contact.title);
                const firstName = sanitizeForCSV(contact.firstName);
                const lastName = sanitizeForCSV(contact.lastName);
                const email = sanitizeForCSV(contact.emails && contact.emails.length > 0 ? contact.emails[0].emailAddress : "");
                const phone = sanitizeForCSV(contact.phones && contact.phones.length > 0 ? contact.phones[0].phoneNumber : "");
                
                csvContent += `"${title}","${firstName}","${lastName}","${email}","${phone}"\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "My_Contacts.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            Swal.fire('Exported!', 'Contacts exported to CSV successfully.', 'success');
        } catch (error) {
            console.error("Export error", error);
            Swal.fire('Error!', 'Failed to export contacts.', 'error');
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            Swal.fire({
                title: 'Importing Contacts...',
                text: 'Please wait while we save your contacts.',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            const text = await file.text();
            const rows = text.split('\n');
            let successCount = 0;
            
            const { token, userId } = getAuthData();
            const parsedUserId = Number.parseInt(userId, 10);

            if (Number.isNaN(parsedUserId)) {
                throw new TypeError("Invalid User ID for import");
            }

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].trim();
                if (!row) continue;
                
                const cols = row.replaceAll('"', '').split(',');
                
                if (cols.length >= 5) {
                    const newContact = {
                        title: cols[0],
                        firstName: cols[1],
                        lastName: cols[2],
                        emails: [{ emailAddress: cols[3], label: "Personal" }],
                        phones: [{ phoneNumber: cols[4], label: "Mobile" }]
                    };
                    
                    try {
                        // URL ko API_BASE_URL se replace kar diya
                        await axios.post(`${API_BASE_URL}/users/${parsedUserId}/contacts`, newContact, {
                            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                        });
                        successCount++;
                    } catch (err) {
                        console.error("Failed to import row", i, err);
                    }
                }
            }
            
            Swal.close();
            Swal.fire('Import Complete', `Successfully imported ${successCount} contacts!`, 'success');
            loadContacts(0, pageSize, ""); 

        } catch (error) {
            console.error("Failed to read file", error);
            Swal.close();
            Swal.fire('Error', 'Failed to read the imported file.', 'error');
        }
        
        event.target.value = null; 
    };

    const startEdit = (contact) => {
        setEditingContact(contact);
    };

    const handleUpdateSuccess = () => {
        setEditingContact(null);
        loadContacts(currentPage, pageSize, searchTerm);
    };

    const handleCancel = () => {
        setEditingContact(null);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-4 bg-white shadow-sm rounded-4 border">
                <div className="d-flex align-items-center mb-3 mb-md-0 gap-3">
                    <h3 className="text-primary fw-bold m-0" style={{ letterSpacing: '0.5px' }}>
                        All Contacts
                    </h3>
                    
                    <div className="d-flex gap-2 ms-3">
                        <button type="button" onClick={handleExport} className="btn btn-sm btn-outline-success fw-bold rounded-pill px-3 shadow-sm">
                            📤 Export
                        </button>
                        
                        <input 
                            type="file" 
                            accept=".csv" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleImport} 
                        />
                        <button type="button" onClick={() => fileInputRef.current.click()} className="btn btn-sm btn-outline-primary fw-bold rounded-pill px-3 shadow-sm">
                            📥 Import
                        </button>
                    </div>
                </div>

                <div className="input-group" style={{ maxWidth: '350px', width: '100%' }}>
                    <span className="input-group-text bg-light border-end-0 text-muted px-3" style={{ borderTopLeftRadius: '50rem', borderBottomLeftRadius: '50rem' }}>
                        🔍
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 bg-light shadow-none py-2"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(0); 
                        }}
                        style={{ borderTopRightRadius: '50rem', borderBottomRightRadius: '50rem', borderLeft: 'none' }}
                    />
                </div>
            </div>

            <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                                <tr>
                                    <th className="px-4 py-3 fw-semibold">Title</th>
                                    <th className="py-3 fw-semibold">First Name</th>
                                    <th className="py-3 fw-semibold">Last Name</th>
                                    <th className="py-3 fw-semibold">Email</th>
                                    <th className="py-3 fw-semibold">Phone</th>
                                    <th className="py-3 fw-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(contacts) && contacts.map((contact) => (
                                    <tr key={contact.id}>
                                        <td className="px-4 fw-medium text-dark">{contact.title}</td>
                                        <td>{contact.firstName}</td>
                                        <td>{contact.lastName || '-'}</td>
                                        <td className="text-muted">{contact.emails && contact.emails.length > 0 ? contact.emails[0].emailAddress : 'N/A'}</td>
                                        <td className="text-muted">{contact.phones && contact.phones.length > 0 ? contact.phones[0].phoneNumber : 'N/A'}</td>
                                        <td className="text-center">
                                            <button
                                                type="button"
                                                className="btn btn-sm me-2 text-white shadow-sm rounded-pill px-3"
                                                style={{ backgroundColor: '#6366f1' }}
                                                onClick={() => setViewingContact(contact)}>
                                                View
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-info me-2 text-white shadow-sm rounded-pill px-3"
                                                onClick={() => startEdit(contact)}>
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger shadow-sm rounded-pill px-3"
                                                onClick={() => deleteContact(contact.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {contacts.length === 0 && (
                            <div className="text-center p-5 text-muted">
                                <h6 className="mb-0">No contacts found...</h6>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card-footer bg-white border-top-0 p-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <button
                            type="button"
                            className="btn btn-outline-primary rounded-pill px-4"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            Previous
                        </button>

                        <div className="d-flex align-items-center gap-4">
                            <span className="fw-semibold text-muted small">
                                Page {currentPage + 1} of {totalPages === 0 ? 1 : totalPages}
                            </span>

                            <div className="d-flex align-items-center bg-light px-3 py-1 rounded-pill border">
                                <label htmlFor="pageSizeSelect" className="me-2 mb-0 small fw-bold text-secondary">Rows:</label>
                                <select
                                    id="pageSizeSelect"
                                    className="form-select form-select-sm border-0 bg-transparent shadow-none p-0 text-primary fw-bold"
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(0);
                                    }}
                                    style={{ cursor: 'pointer', width: '40px' }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn btn-outline-primary rounded-pill px-4"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1 || totalPages === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {editingContact && (
                <EditContact
                    contactToEdit={editingContact}
                    onUpdateSuccess={handleUpdateSuccess}
                    onCancel={handleCancel}
                />
            )}

            {viewingContact && (
                <ViewContact
                    contact={viewingContact}
                    onClose={() => setViewingContact(null)}
                />
            )}
        </div>
    );
};

export default ContactList;