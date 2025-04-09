"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

export default function Home() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPeliculas() {
      try {
        const response = await fetch('https://tallerapi.onrender.com/peliculas');
        if (!response.ok) {
          throw new Error('Error al cargar las películas');
        }
        const data = await response.json();
        setPeliculas(data.peliculas);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchPeliculas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Cargando películas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Catálogo de Películas</title>
        <meta name="description" content="Dashboard de películas" />
      </Head>

      <main className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Catálogo de Películas
          </h1>

          {peliculas.length === 0 ? (
            <div className="text-center text-gray-600 text-xl">
              No hay películas disponibles
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {peliculas.map((pelicula) => (
                <Link href={`/peliculas/${pelicula.id}`} key={pelicula.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full flex flex-col">
                    <div className="relative h-64 w-full">
                      {pelicula.imageURL ? (
                        <Image
                          src={pelicula.imageURL}
                          alt={pelicula.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                          <span className="text-gray-500">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {pelicula.name}
                      </h2>
                      <p className="text-gray-600">
                        {pelicula.releaseYear} • {pelicula.director}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}