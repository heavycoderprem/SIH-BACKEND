"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/ui/form";
import { Input } from "@/components/ui/ui/input";
import { signUpformValidation } from "@/lib";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/lib/api/auth";

const SignUpForm = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(signUpformValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(values) {
    try {
      const response = await registerUser(values);
      console.log("User Registered Successfully: ", response);

      navigate("/sign-in");
    } catch (error) {
      console.error("Registration error: ", error.response?.data || error.message);
    }
  }
  return (
    <div className="p-5">
      <Form {...form}>
        <div className=" flex-col sm:w-420">
          
          <h2 className="pt-5 sm:pt-12 ">Create a new account</h2>
          <p className="mt-2 mb-4">
            To use Socialcalc, Please enter your details
          </p>

          <div className="sm:w-420">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="form-input"
                        
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="form-input"
                        
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="form-input"
                        
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="border-[1px] border-black text-black hover:bg-slate-800 hover:border-0 hover:text-white"
              >
                Create account
              </Button>

              <p className="text-gray-600 text-opacity-90 hover:scale-[1.03]">
              Already have an account?
              <Link to="/sign-in" className="text-purple-700 text-small ml-1">Log in</Link>

              </p>
            </form>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SignUpForm;
