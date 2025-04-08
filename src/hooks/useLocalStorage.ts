import { useState, useEffect } from "react";

// Hook personalizado para trabalhar com localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Obter do localStorage pelo key
      const item = window.localStorage.getItem(key);
      // Analisar JSON armazenado ou retornar initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Retornar uma versão envolvida do setState do useState que...
  // ... persiste o novo valor no localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que o valor seja uma função, para que tenhamos a mesma API do useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Salvar o estado
      setStoredValue(valueToStore);
      // Salvar no localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Atualiza o valor armazenado se a chave mudar
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.log(error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  return [storedValue, setValue] as const;
}
