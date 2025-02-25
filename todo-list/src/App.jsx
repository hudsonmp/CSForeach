import {useState} from "react";
import "./style.css";
import { Form } from "./form";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function App() {
  const [todos, setTodos] = useState([])

  function toggleTodo(id, completed) {
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if (todo.id === id) {
          return {...todo, completed}
        }
        return todo
      })
    })
  }

  function deleteTodo(id) {
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id)
    })
  }

  function handleDragEnd(result) {
    if (!result.destination) return;
    
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTodos(items);
  }

  return ( 
    <>
      <Form setTodos={setTodos} />
      <h1 className="header">To-Do List</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided, snapshot) => (
            <ul 
              className="list" 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? 'rgba(74, 144, 226, 0.05)' : 'transparent',
                padding: '1rem',
                borderRadius: '12px',
                transition: 'background 0.2s ease'
              }}
            >
              {todos.length === 0 && "Get to Work!"}
              {todos.map((todo, index) => (
                <Draggable 
                  key={todo.id} 
                  draggableId={todo.id} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? 'dragging' : ''}
                      style={{
                        ...provided.draggableProps.style,
                        paddingLeft: '2rem'
                      }}
                    >
                      <label>
                        <input 
                          type="checkbox" 
                          checked={todo.completed}
                          onChange={e => toggleTodo(todo.id, e.target.checked)}
                        />
                        {todo.text}
                      </label>
                      <button 
                        onClick={() => deleteTodo(todo.id)} 
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}