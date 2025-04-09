"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

export default function DetallePelicula() {
  const router = useRouter();
  const { id } = router.query;
  
  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchPelicula() {
      try {
        const response = await fetch(`https://tallerapi.onrender.com/peliculas/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Película no encontrada');
          }
          throw new Error('Error al cargar la película');
        }
        const data = await response.json();
        setPelicula(data.pelicula);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchPelicula();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Cargando información...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold text-red-600 mb-4">Error: {error}</div>
        <Link href="/">
          <div className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Volver al inicio
          </div>
        </Link>
      </div>
    );
  }

  if (!pelicula) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{pelicula.name} | Detalle de Película</title>
        <meta name="description" content={`Información sobre ${pelicula.name}`} />
      </Head>

      <main className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="relative h-96 md:h-full w-full">
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
            </div>

            <div className="md:w-2/3 p-8">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{pelicula.name}</h1>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  {pelicula.releaseYear}
                </span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <span className="font-semibold">Director:</span>
                  <span>{pelicula.director}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <span className="font-semibold">Duración:</span>
                  <span>{pelicula.duration} minutos</span>
                </div>
              </div>
              
              <Link href="/">
                <div className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Volver al catálogo
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}