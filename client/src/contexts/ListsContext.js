// client/src/contexts/ListsContext.js

import React, { createContext, useState, useEffect } from "react";
import { getLists, createList, deleteList, updateList } from "../services/api";

// Create the Context
export const ListsContext = createContext();

// Create the Provider component
export const ListsProvider = ({ children }) => {
  const [lists, setLists] = useState([]);

  // Fetch lists from the backend
  const fetchLists = async () => {
    try {
      const response = await getLists();
      setLists(response.data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // Handle creating a new list
  const handleCreateList = async (name) => {
    if (name.trim() === "") return;
    try {
      await createList(name);
      fetchLists();
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  // Handle deleting a list
  const handleDeleteList = async (id) => {
    try {
      await deleteList(id);
      fetchLists();
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  // Handle updating a list
  const handleEditList = async (id, name) => {
    if (name.trim() === "") return;
    try {
      await updateList(id, name);
      fetchLists();
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  return (
    <ListsContext.Provider
      value={{
        lists,
        handleCreateList,
        handleDeleteList,
        handleEditList,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
};
