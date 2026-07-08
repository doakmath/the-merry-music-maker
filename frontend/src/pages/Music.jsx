import { useEffect, useState } from "react";

import { getSongs } from "../api/songs";


function Music() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getSongs()
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return <p>Loading songs...</p>;
  }


  return (
    <div>
      <h1>Music</h1>

      {songs.map((song) => (
        <div key={song.id}>
          <h2>{song.title}</h2>
          <p>{song.description}</p>
        </div>
      ))}
    </div>
  );
}


export default Music;
