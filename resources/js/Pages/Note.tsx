import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

interface Note {
    id: number;
    title: string;
    content: string;
    is_offline?: boolean; // Đánh dấu ghi chú chưa được sync
}

interface Props {
    notes: Note[];
}

export default function Index({ notes }: Props) {
    const [offlineNotes, setOfflineNotes] = useState<Note[]>([]);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        content: '',
    });

    // 1. Load ghi chú offline từ LocalStorage khi khởi tạo
    useEffect(() => {
        const saved = localStorage.getItem('offline_notes');
        if (saved) setOfflineNotes(JSON.parse(saved));
    }, []);

    // 2. Hàm xử lý lưu ghi chú (Smart Save)
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!navigator.onLine) {
            // Chế độ Offline
            const newOfflineNote: Note = {
                id: Date.now(),
                title: data.title,
                content: data.content,
                is_offline: true
            };
            const updatedOffline = [...offlineNotes, newOfflineNote];
            setOfflineNotes(updatedOffline);
            localStorage.setItem('offline_notes', JSON.stringify(updatedOffline));
            reset();
            alert("Đã lưu tạm offline!");
        } else {
            // Chế độ Online
            post(route('notes.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    // 3. Tự động đồng bộ khi mạng quay trở lại
    useEffect(() => {
        const handleOnline = () => {
            const saved = localStorage.getItem('offline_notes');
            if (saved) {
                const toSync: Note[] = JSON.parse(saved);
                toSync.forEach(note => {
                    router.post(route('notes.store'), {
                        title: note.title,
                        content: note.content
                    }, {
                        onSuccess: () => {
                            // Xóa dần note đã sync thành công
                            setOfflineNotes(prev => {
                                const remain = prev.filter(n => n.id !== note.id);
                                localStorage.setItem('offline_notes', JSON.stringify(remain));
                                return remain;
                            });
                        }
                    });
                });
            }
        };

        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Head title="Ghi chú của tôi" />

            <h1 className="text-2xl font-bold mb-6">Ghi chú cá nhân</h1>

            {/* Form tạo ghi chú */}
            <form onSubmit={submit} className="mb-10 bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tiêu đề..."
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        value={data.title}
                        onChange={e => setData('title', e.target.value)}
                    />
                    {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
                </div>
                <div className="mb-4">
                    <textarea
                        placeholder="Nội dung ghi chú..."
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        rows={3}
                        value={data.content}
                        onChange={e => setData('content', e.target.value)}
                    />
                    {errors.content && <div className="text-red-500 text-sm">{errors.content}</div>}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? 'Đang lưu...' : 'Lưu ghi chú'}
                </button>
            </form>

            {/* Danh sách ghi chú */}
            <div className="grid gap-4">
                {/* Ghi chú Offline (Chưa đồng bộ) */}
                {offlineNotes.map(note => (
                    <div key={note.id} className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow-sm">
                        <div className="flex justify-between">
                            <h3 className="font-bold">{note.title}</h3>
                            <span className="text-xs font-semibold text-yellow-600 uppercase italic">Offline</span>
                        </div>
                        <p className="text-gray-600">{note.content}</p>
                    </div>
                ))}

                {/* Ghi chú Online (Từ Server) */}
                {notes.map(note => (
                    <div key={note.id} className="p-4 bg-white border rounded shadow-sm">
                        <h3 className="font-bold">{note.title}</h3>
                        <p className="text-gray-600">{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}