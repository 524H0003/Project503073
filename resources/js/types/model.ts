export type Label = {
    id: number;
    user_id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    user?: User;
    notes?: Note[];
};
export type Note = {
    id: number;
    user_id: number;
    title: string;
    content: string;
    created_at?: string;
    updated_at?: string;
    pinned_at?: string;
    is_locked: any;
    is_opened: any;
    user?: User;
    labels?: Label[];
};
export type User = {
    id: number;
    name: string;
    email: string;
    created_at?: string;
    updated_at?: string;
    preferences?: string;
    email_verified_at?: string;
    avatar?: string;
    notes?: Note[];
    labels?: Label[];
};
