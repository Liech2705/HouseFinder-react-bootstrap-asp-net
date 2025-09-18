import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb mb-0">
        {items.map((it, idx) => {
          const isLast = idx === items.length - 1 || it.active;
          return (
            <li
              key={idx}
              className={`breadcrumb-item${isLast ? ' active' : ''}`}
              {...(isLast ? { 'aria-current': 'page' } : {})}
            >
              {isLast ? (
                it.label
              ) : (
                <Link to={it.to || '#'} className="text-decoration-none">
                  {it.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}