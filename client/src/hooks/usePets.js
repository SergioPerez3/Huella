import { useState, useEffect } from "react";
import { getPets } from "../services/petService.js";

const usePets = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    getPets()
      .then((res) => setPets(res.data))
      .catch(() => setPets([]));
  }, []);

  return pets;
};

export default usePets;
