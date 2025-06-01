import React, { useEffect, useState, useRef, useCallback } from 'react';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Fetch photos from the API
  const fetchPhotos = async () => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`);
    const data = await res.json();

    if (data.length === 0) {
      setHasMore(false);
    } else {
      setPhotos((prev) => [...prev, ...data]);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [page]);

  // Intersection Observer to load more photos on scroll
  const lastPhotoRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Infinite Scroll Photos</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px',
        }}
      >
        {photos.map((photo, index) => {
          if (photos.length === index + 1) {
            // Attach observer to last photo element
            return (
              <div
                key={index}
                ref={lastPhotoRef}
                style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}
              >
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                />
                <p style={{ fontSize: '14px', marginTop: '8px' }}>{photo.title}</p>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}
              >
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                />
                <p style={{ fontSize: '14px', marginTop: '8px' }}>{photo.title}</p>
              </div>
            );
          }
        })}
      </div>
      {!hasMore && <p style={{ textAlign: 'center', marginTop: '20px' }}>All photos loaded.</p>}
    </div>
  );
};

export default App;
