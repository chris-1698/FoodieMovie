import { SignUp } from "@clerk/clerk-react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { ROUTING_MANAGER } from "../../navigation/Router";

const Register = () => {
    return (
        <AuthLayout>
            <SignUp />
        </AuthLayout>
    );
}