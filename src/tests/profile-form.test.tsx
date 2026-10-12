import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UpdateProfileForm } from "@/components/profile/UpdateProfileForm";

const {
  push,
  refresh,
  updateUser,
  getSession,
} = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  updateUser: vi.fn(),
  getSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    updateUser,
    getSession,
  },
}));

describe("UpdateProfileForm", () => {
  it("prefills the current name and rejects too-short names", async () => {
    render(<UpdateProfileForm initialName="রেজওয়ান" />);
    const input = screen.getByLabelText("নাম");
    expect(input).toHaveValue("রেজওয়ান");
    fireEvent.change(input, { target: { value: "A" } });
    fireEvent.submit(input.closest("form")!);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("persists the update through Better Auth and navigates back", async () => {
    updateUser.mockResolvedValue({
      data: { user: { name: "নতুন নাম" } },
      error: null,
    });
    getSession.mockResolvedValue({
      data: { user: { name: "নতুন নাম" } },
      error: null,
    });
    render(<UpdateProfileForm initialName="রেজওয়ান" />);
    fireEvent.change(screen.getByLabelText("নাম"), {
      target: { value: "নতুন নাম" },
    });
    fireEvent.click(screen.getByRole("button", { name: "আপডেট করুন" }));
    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith({ name: "নতুন নাম" }),
    );
    expect(getSession).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/profile");
    expect(refresh).toHaveBeenCalled();
  });
});
