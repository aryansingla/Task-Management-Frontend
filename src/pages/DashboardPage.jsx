import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, CircularProgress, Dialog, DialogActions, DialogContent, TextField, Button, Skeleton, AppBar, Toolbar, Avatar, Menu, MenuItem, DialogTitle, Grid, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';


const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: moment().format('YYYY-MM-DD'), status: 'pending' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [userDetails, setUserDetails] = useState({ name: '', email: '' });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);


    const openUserMenu = Boolean(anchorEl);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const requestOptions = {
                method: 'GET',
                url: `${backendUrl}/api/tasks`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };

            axios(requestOptions)
                .then((response) => {
                    setTasks(response.data.tasks);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        if (!localStorage.getItem('token')) {
            navigate('/login');
        } else {
            fetchTasks();
            const userInfo = JSON.parse(localStorage.getItem('user')) || {};
            setUserDetails(userInfo);
        }
    }, [navigate]);

    const handleDelete = (taskId) => {
        setTaskToDelete(taskId);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = () => {
        setLoadingDelete(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const requestOptions = {
            method: 'DELETE',
            url: `${backendUrl}/api/tasks/${taskToDelete}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        };

        axios(requestOptions)
            .then(() => {
                setTasks(tasks.filter((task) => task._id !== taskToDelete));
                setOpenDeleteDialog(false);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoadingDelete(false);
            });
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setOpenDialog(true);
        setNewTask({
            title: task.title,
            description: task.description,
            dueDate: moment(task.dueDate).format('YYYY-MM-DD'),
            status: task.status,
        });
    };

    const handleUpdate = () => {
        setLoadingUpdate(true);

        const updatedTask = {
            title: newTask.title,
            description: newTask.description,
            dueDate: newTask.dueDate,
            status: newTask.status,
        };

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const requestOptions = {
            method: 'PUT',
            url: `${backendUrl}/api/tasks/${selectedTask._id}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            data: updatedTask,
        };

        axios(requestOptions)
            .then(() => {
                setTasks(
                    tasks.map((task) =>
                        task._id === selectedTask._id ? { ...task, ...updatedTask } : task
                    )
                );
                setOpenDialog(false);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoadingUpdate(false);
            });
    };


    const handleChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const handleCreateNewTask = () => {
        setLoadingCreate(true);
        const taskData = {
            title: newTask.title,
            description: newTask.description,
            dueDate: newTask.dueDate,
            status: newTask.status,
        };

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const requestOptions = {
            method: 'POST',
            url: `${backendUrl}/api/tasks`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            data: taskData,
        };

        axios(requestOptions)
            .then((response) => {
                setTasks([...tasks, response.data.task]);
                setNewTask({ title: '', description: '', dueDate: '', status: 'pending' });
                setOpenDialog(false);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoadingCreate(false);
            });
    };


    const handleUserMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Box p={1}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <IconButton onClick={handleUserMenuOpen}>
                        <Avatar>{userDetails?.name?.charAt(0)}</Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={openUserMenu}
                        onClose={handleUserMenuClose}
                    >
                        <MenuItem>
                            <Typography>Name: {userDetails.name}</Typography>
                        </MenuItem>
                        <MenuItem>
                            <Typography>Email: {userDetails.email}</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <Button variant="outlined" color="error">Logout</Button>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                    setSelectedTask(null);
                    setNewTask({
                        title: '',
                        description: '',
                        dueDate: moment().format('YYYY-MM-DD'),
                        status: 'pending',
                    });
                    setOpenDialog(true);
                }}
                sx={{ marginBottom: 2, marginTop: 2 }}
            >
                Create New Task
            </Button>

            {loading ? (
                <Box>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Skeleton variant="rectangular" width="100%" height={118} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Skeleton variant="rectangular" width="100%" height={118} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Skeleton variant="rectangular" width="100%" height={118} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Skeleton variant="rectangular" width="100%" height={118} />
                        </Grid>
                    </Grid>
                </Box>
            ) : tasks.length === 0 ? (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">

                    <img src="/no-data-found-img.jpg" alt="No tasks available" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                    <Typography variant="h5" sx={{ marginTop: 2, color: '#3f51b5', fontWeight: 'bold' }}>
                        No Tasks Available
                    </Typography>
                </Box>

            ) : (
                <Box mt={2}>
                    {tasks.map((task) => (
                        <Card
                            key={task._id}
                            variant="outlined"
                            sx={{
                                marginBottom: 2,
                                position: 'relative',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 3,
                                },
                            }}
                        >
                            <CardContent>
                               
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={() => handleEdit(task)} sx={{ color: 'blue' }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(task._id)} sx={{ color: 'red' }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                                <Typography variant="h6">{task.title}</Typography>
                                <Typography>{task.description}</Typography>
                                <Typography>Due: {moment(task.dueDate).format('DD MMM YYYY')}</Typography>

                                {/* Status with Chip */}
                                <Box display="flex" alignItems="center" mt={1}>
                                    <Typography>Status: </Typography>
                                    <Chip
                                        label={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                        color={task.status === 'completed' ? 'success' : 'primary'}
                                        sx={{ marginLeft: 1 }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{selectedTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        name="title"
                        value={newTask.title}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        name="description"
                        value={newTask.description}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        label="Due Date"
                        fullWidth
                        type="date"
                        name="dueDate"
                        value={newTask?.dueDate}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        label="Status"
                        fullWidth
                        select
                        name="status"
                        value={newTask.status}
                        onChange={handleChange}
                        margin="normal"
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={selectedTask ? handleUpdate : handleCreateNewTask}
                        color="primary"
                        disabled={loadingCreate || loadingUpdate} 
                        startIcon={loadingCreate || loadingUpdate ? <CircularProgress size={24} color="inherit" /> : null}
                    >
                        {selectedTask ? (loadingUpdate ? 'Updating...' : 'Update') : (loadingCreate ? 'Creating...' : 'Create')}
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    {loadingDelete ? (
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Typography>
                            Are you sure you want to delete this task?
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setOpenDeleteDialog(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={confirmDelete}
                        disabled={loadingDelete}
                    >
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DashboardPage;
