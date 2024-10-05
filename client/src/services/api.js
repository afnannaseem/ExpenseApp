// client/src/services/api.js

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Lists
export const getLists = async () => {
  return await axios.get(`${API_URL}/lists`);
};

export const createList = async (name) => {
  return await axios.post(`${API_URL}/lists`, { name });
};

export const updateList = async (id, name) => {
  return await axios.put(`${API_URL}/lists/${id}`, { name });
};

export const deleteList = async (id) => {
  return await axios.delete(`${API_URL}/lists/${id}`);
};

// Expenses
export const getExpenses = async (listId) => {
  return await axios.get(`${API_URL}/expenses/${listId}`);
};

export const createExpense = async (listId, expenseData) => {
  return await axios.post(`${API_URL}/expenses/${listId}`, expenseData);
};

export const updateExpense = async (listId, expenseId, expenseData) => {
  return await axios.put(
    `${API_URL}/expenses/${listId}/${expenseId}`,
    expenseData
  );
};

export const deleteExpense = async (listId, expenseId) => {
  return await axios.delete(`${API_URL}/expenses/${listId}/${expenseId}`);
};
