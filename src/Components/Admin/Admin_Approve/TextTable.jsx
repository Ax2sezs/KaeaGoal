import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const TextTable = ({
    data = [],
    currentPage,
    totalPage,
    pageSize = 20,
    onPageChange,
    approve,
    isTableLayout,
    view,
}) => {

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${date.getFullYear()} ${date
                .getHours()
                .toString()
                .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };
    const [fullText, setFullText] = useState('');
    const [fullName, setFullName] = useState('');

    const handleShowMore = (item) => {
        setFullText(item.text?.join('\n') || '-');
        setFullName(item.useR_NAME)
        document.getElementById('extend_text_modal').showModal();
    };

    return (
        <>
            {isTableLayout ? (
                <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 mt-4">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-center">Is Active</th>
                                <th className="px-4 py-3 text-center">ID</th>
                                <th className="px-4 py-3 text-center">Name</th>
                                <th className="px-4 py-3 text-center">Site</th>
                                <th className="px-4 py-3 text-center">Department</th>
                                <th className="px-4 py-3 text-center w-96">Text</th>
                                <th className="px-4 py-3 text-center">Submit Date</th>
                                <th className="px-4 py-3 text-center">Approve</th>
                                <th className="px-4 py-3 text-center">Approver</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data.map((item) => (
                                <tr key={item.useR_TEXT_MISSION_ID}>
                                    <td className="px-4 py-3 border-r">
                                        <button
                                            className={`btn btn-sm flex items-center gap-1 btn-outline ${item.is_View ? 'btn-success' : 'btn-error'}`}
                                            onClick={() => view(item.useR_TEXT_MISSION_ID, !item.is_View)}
                                            disabled={item.approve != true}
                                        >
                                            {item.is_View ? (
                                                <>
                                                    <VisibilityOffIcon fontSize="small" />
                                                    HIDE
                                                </>
                                            ) : (
                                                <>
                                                    <VisibilityIcon fontSize="small" />
                                                    SHOW
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 border-r">{item.logoN_NAME}</td>
                                    <td className="px-4 py-3 border-r">{item.useR_NAME}</td>
                                    <td className="px-4 py-3 border-r">{item.branchCode}</td>
                                    <td className="px-4 py-3 border-r">{item.department}</td>
                                    <td className="px-4 py-3 whitespace-pre-wrap border-r">
                                        {item.text?.join('\n').length > 200 ? (
                                            <>
                                                {item.text.join('\n').slice(0, 200)}...
                                                <button
                                                    className="text-blue-500 underline ml-2 text-sm"
                                                    onClick={() => handleShowMore(item)}
                                                >
                                                    Show more
                                                </button>
                                            </>
                                        ) : (
                                            item.text?.join('\n') || '-'
                                        )}                                    </td>
                                    <td className="px-4 py-3 border-r">
                                        {formatDate(item.submiT_DATE)}
                                    </td>
                                    <td className="px-4 py-3 text-center border-r">
                                        {item.approve === null ? (
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    className="btn btn-success btn-xs"
                                                    onClick={() => approve(item.useR_MISSION_ID, true)}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-error btn-xs"
                                                    onClick={() => approve(item.useR_MISSION_ID, false)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : item.approve === true ? (
                                            <span className="text-green-500">Approve</span>
                                        ) : (
                                            <span className="text-red-500">Reject</span>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <div>
                                            <span className="text-button-text text-sm">{item.approve_By_NAME}</span>
                                        </div>
                                        <span className="text-gray-400 text-xs">
                                            {item.approve_DATE
                                                ? new Date(item.approve_DATE).toLocaleString('th-TH')
                                                : '-'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {data.map((item) => (
                        <div
                            key={item.useR_TEXT_MISSION_ID}
                            className="bg-white rounded-lg shadow border p-4 flex flex-col justify-between gap-2"
                        >
                            <div className='flex justify-between'>
                                <span className="text-lg font-semibold">{item.useR_NAME}</span>
                                <button
                                    className={`btn btn-sm flex items-center gap-1 btn-outline ${item.is_View ? 'btn-success' : 'btn-error'}`}
                                    onClick={() => view(item.useR_TEXT_MISSION_ID, !item.is_View)}
                                    disabled={item.approve != true}
                                >
                                    {item.is_View ? (
                                        <>
                                            <VisibilityOffIcon fontSize="small" />
                                            HIDE
                                        </>
                                    ) : (
                                        <>
                                            <VisibilityIcon fontSize="small" />
                                            SHOW
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="text-sm text-gray-500">{item.logoN_NAME} - {item.branchCode} - {item.department}</div>
                            <div className="whitespace-pre-wrap break-words text-button-text bg-slate-100 h-40 rounded-lg p-2 overflow-y-auto">
                                {item.text?.join('\n').length > 255 ? (
                                    <>
                                        {item.text.join('\n').slice(0, 255)}...
                                        <button
                                            className="text-blue-500 underline ml-2 text-sm"
                                            onClick={() => handleShowMore(item)}
                                        >
                                            Show more
                                        </button>
                                    </>
                                ) : (
                                    item.text?.join('\n') || '-'
                                )}
                            </div>
                            <div className='flex flex-row justify-between mt-2'>
                                <span className="text-sm">Submit Date:</span>
                                <span className='text-sm'> {new Date(item.submiT_DATE).toLocaleString('th-TH')}</span>
                            </div>
                            <hr className='my-2'></hr>
                            <div className='flex flex-row justify-between'>
                                <span className="text-sm ">Approve Date:<br></br>{item.approve_DATE ? new Date(item.approve_DATE).toLocaleString('th-TH') : '-'}</span>
                                <span className='text-sm'>Approver:<br></br>{item.approve_By_NAME}</span>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                {item.approve === null ? (
                                    <>
                                        <button className="btn btn-success btn-sm" onClick={() => approve(item.useR_MISSION_ID, true)}>
                                            Approve
                                        </button>
                                        <button className="btn btn-error btn-sm" onClick={() => approve(item.useR_MISSION_ID, false)}>
                                            Reject
                                        </button>
                                    </>
                                ) : item.approve === true ? (
                                    <span className="text-green-500">Approved</span>
                                ) : (
                                    <span className="text-red-500">Rejected: {item.reject_Des}</span>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center space-x-2 mt-4">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-sm px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-3 py-1 border rounded bg-gray-100">
                    Page {currentPage} / {totalPage}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPage}
                    className="btn btn-sm px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <dialog id="extend_text_modal" className="modal">
                <div className="modal-box max-w-2xl bg-bg text-button-text">
                    <h3 className="font-bold text-lg mb-3">By {fullName}</h3>
                    <p className="whitespace-pre-wrap text-gray-700">{fullText}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

        </>
    );
};

export default TextTable;
