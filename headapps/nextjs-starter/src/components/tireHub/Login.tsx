import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

type PageContentProps = {
    params: { [key: string]: string };
};

export const Default = (props: PageContentProps): JSX.Element => {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signIn("credentials", { username, password });
    };

    return (
        <div className={`component content ${props?.params?.styles}`}>
            <div className="component-content">
                {loading ? (
                    <div>Loading...</div>
                ) : session ? (
                    <>
                        <h1>Welcome, {session.user?.name}</h1>
                        <div className="user-profile">
                            {session.user?.image && (
                                <Image
                                    src={session.user.image}
                                    width={50}
                                    height={50}
                                    alt={session.user?.name || "User profile"}
                                    style={{ borderRadius: "50%" }}
                                />
                            )}
                            <p>Signed: {session.user?.email}</p>
                            <p>Roles: {Array.isArray(session.user?.roles) 
                                ? session.user.roles.join(', ') 
                                : (session.user?.roles)}</p>
                            <button
                                onClick={() => signOut()}
                                className="btn btn-outline-danger"
                            >
                                Sign out
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Login</h1>
                        <p>Please sign in to access the content</p>
                        <p>Admin: admin/admin</p>
                        <p>Test User: test/test</p>
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input 
                                    id="username"
                                    type="text" 
                                    className="form-control" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    id="password"
                                    type="password" 
                                    className="form-control" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Sign In</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};