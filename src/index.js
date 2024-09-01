import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    const queryParams = new URLSearchParams(window.location.search);
    this.state = {
      items: [],
      newItemText: "",
      searchText: queryParams.get("search") || "",
      editingItemId: null,
      editingItemText: "",
    };
  }

  componentDidMount() {
    // Simulate fetching data from a JSON file
    const dummyData = [
      {
        id: 1,
        text: "Learn JavaScript",
        description: "Basics of JS",
        done: false,
        timestamp: new Date().toLocaleString(),
      },
      {
        id: 2,
        text: "Learn React",
        description: "React components and state",
        done: false,
        timestamp: new Date().toLocaleString(),
      },
      {
        id: 3,
        text: "Play around in JSFiddle",
        description: "Experimenting with JSFiddle",
        done: true,
        timestamp: new Date().toLocaleString(),
      },
      {
        id: 4,
        text: "Build something awesome",
        description: "Create a project with JS and React",
        done: true,
        timestamp: new Date().toLocaleString(),
      },
    ];
    this.setState({ items: dummyData });
  }

  handleInputChange = (e) => {
    this.setState({ newItemText: e.target.value });
  };

  handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      text: this.state.newItemText,
      description: "New task description",
      done: false,
      timestamp: new Date().toLocaleString(),
    };
    this.setState((prevState) => ({
      items: [...prevState.items, newItem],
      newItemText: "",
    }));
  };

  handleToggleDone = (id) => {
    this.setState((prevState) => ({
      items: prevState.items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    }));
  };

  handleDeleteItem = (id) => {
    this.setState((prevState) => ({
      items: prevState.items.filter((item) => item.id !== id),
    }));
  };

  handleEditItem = (id) => {
    const item = this.state.items.find((item) => item.id === id);
    this.setState({ editingItemId: id, editingItemText: item.text });
  };

  handleUpdateItem = () => {
    this.setState((prevState) => ({
      items: prevState.items.map((item) =>
        item.id === prevState.editingItemId
          ? {
              ...item,
              text: prevState.editingItemText,
              timestamp: new Date().toLocaleString(),
            }
          : item
      ),
      editingItemId: null,
      editingItemText: "",
    }));
  };

  handleSearchChange = (e) => {
    const searchText = e.target.value;
    this.setState({ searchText });
    const queryParams = new URLSearchParams(window.location.search);
    if (searchText) {
      queryParams.set("search", searchText);
    } else {
      queryParams.delete("search");
    }
    window.history.pushState(null, "", "?" + queryParams.toString());
  };

  render() {
    const filteredItems = this.state.items.filter((item) =>
      item.text.toLowerCase().includes(this.state.searchText.toLowerCase())
    );

    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Todo List</h2>
        <input
          type="text"
          value={this.state.searchText}
          onChange={this.handleSearchChange}
          placeholder="Search tasks"
          style={styles.input}
        />
        <input
          type="text"
          value={this.state.newItemText}
          onChange={this.handleInputChange}
          placeholder="New task"
          style={styles.input}
        />
        <button onClick={this.handleAddItem} style={styles.addButton}>
          Add
        </button>
        {this.state.editingItemId && (
          <div style={styles.editSection}>
            <h3>Edit Task</h3>
            <input
              type="text"
              value={this.state.editingItemText}
              onChange={(e) =>
                this.setState({ editingItemText: e.target.value })
              }
              style={styles.input}
            />
            <button onClick={this.handleUpdateItem} style={styles.button}>
              Update
            </button>
          </div>
        )}
        <ol style={styles.list}>
          {filteredItems.map((item) => (
            <li key={item.id} style={styles.listItem}>
              <div style={styles.itemContent}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => this.handleToggleDone(item.id)}
                    style={styles.checkbox}
                  />
                  <span
                    className={item.done ? "done" : ""}
                    style={item.done ? styles.done : styles.notDone}
                  >
                    {item.text}
                  </span>
                </label>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => this.handleEditItem(item.id)}
                    style={{ ...styles.button, ...styles.buttonEdit }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => this.handleDeleteItem(item.id)}
                    style={{ ...styles.button, ...styles.buttonDelete }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div style={styles.description}>
                <p>{item.description}</p>
                <p style={styles.timestamp}>{item.timestamp}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7fa",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    width: "calc(100% - 24px)",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "16px",
  },
  addButton: {
    display: "block",
    width: "100%",
    padding: "10px 0",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s",
  },
  itemContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkbox: {
    marginRight: "10px",
  },
  button: {
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  buttonDelete: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  buttonEdit: {
    backgroundColor: "#ffc107",
    color: "#fff",
  },
  description: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#555",
  },
  timestamp: {
    fontSize: "12px",
    color: "#888",
  },
  done: {
    color: "rgba(0, 0, 0, 0.3)",
    textDecoration: "line-through",
  },
  notDone: {
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  editSection: {
    marginTop: "20px",
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <TodoApp/>
);