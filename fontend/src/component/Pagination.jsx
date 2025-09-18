import React from 'react';
import PropTypes from 'prop-types';

export default function Pagination({ page, totalPages, onPageChange, maxButtons = 7, showIfSinglePage = false }) {
    if (!showIfSinglePage && totalPages <= 1) return null;

    const makeRange = (start, end) => {
        const res = [];
        for (let i = start; i <= end; i++) res.push(i);
        return res;
    };

    const getPages = () => {
        const pages = [];
        const half = Math.floor(maxButtons / 2);
        if (totalPages <= maxButtons) {
            return makeRange(1, totalPages);
        }

        let start = Math.max(1, page - half);
        let end = Math.min(totalPages, page + half);

        if (start === 1) {
            end = Math.min(totalPages, start + maxButtons - 1);
        } else if (end === totalPages) {
            start = Math.max(1, end - maxButtons + 1);
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('start-ellipsis');
        }

        pages.push(...makeRange(start, end));

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('end-ellipsis');
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <nav aria-label="Pagination" className="mt-4">
            <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" aria-label="Trang trước" onClick={() => onPageChange(Math.max(1, page - 1))}>Trước</button>
                </li>

                {pages.map((p, i) => {
                    if (p === 'start-ellipsis' || p === 'end-ellipsis') {
                        return (
                            <li key={p + i} className="page-item disabled">
                                <span className="page-link">…</span>
                            </li>
                        );
                    }
                    return (
                        <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(p)} aria-current={page === p ? 'page' : undefined}>
                                {p}
                            </button>
                        </li>
                    );
                })}

                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" aria-label="Trang tiếp" onClick={() => onPageChange(Math.min(totalPages, page + 1))}>Tiếp</button>
                </li>
            </ul>
        </nav>
    );
}

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    maxButtons: PropTypes.number,
    showIfSinglePage: PropTypes.bool,
};