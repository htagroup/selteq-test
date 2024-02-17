
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ClockComponent from './ClockComponent';

const mainDiv = {
    width: "50%",
    margin: "50px auto",
}

const inputStyle = {
    height: "20px",
    width: "230px",
    padding: "5px",
}

const buttonStyle = {
    padding: "7px",
    marginLeft: "15px",
    color: "#000",
}

const liStyle = {
    padding: "5px"
}

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTaskText, setEditedTaskText] = useState('');

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            setTasks(storedTasks);
        }
    }, []);

    const addTask = () => {
        if (newTaskText.trim() !== '') {
            const newTask = {
                id: Date.now(),
                text: newTaskText
            };
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setNewTaskText('');
        }
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const editTask = (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, text: editedTaskText } : task
        );
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setEditingTaskId(null);
        setEditedTaskText('');
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setTasks(items);
    };

    return (
        <div style={mainDiv}>
            <ClockComponent />
            <h2>To-Do List</h2>
            <input
                type="text"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                placeholder="Enter a new task"
                style={inputStyle}
            />
            <button onClick={addTask} style={buttonStyle}>Add Task</button>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {tasks.map((task, index) => (
                                <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={liStyle}
                                        >
                                            {editingTaskId === task.id ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={editedTaskText}
                                                        style={inputStyle}
                                                        onChange={e => setEditedTaskText(e.target.value)}
                                                    />
                                                    <button onClick={() => editTask(task.id)} style={buttonStyle}>Save</button>
                                                </>
                                            ) : (
                                                <>
                                                    {task.text}
                                                    <button onClick={() => deleteTask(task.id)} style={buttonStyle}>Delete</button>
                                                    <button onClick={() => {
                                                        setEditingTaskId(task.id);
                                                        setEditedTaskText(task.text);
                                                    }} style={buttonStyle}>Edit</button>
                                                </>
                                            )}
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default TodoList;
