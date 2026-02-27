import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

const Profile = () => {
  const { user, login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/users/profile");
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { data } = await API.put("/users/profile", {
        name,
        email,
        password: password || undefined,
      });

      login({ ...user, ...data });

      setSuccess("Profile updated successfully.");
      setPassword("");
    } catch (err) {
      setError("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your personal information and security
          </p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          {/* Alerts */}
          {success && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-8">
            {/* Profile Info Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Profile Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={email}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Security
              </h2>

              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Must be at least 6 characters.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
