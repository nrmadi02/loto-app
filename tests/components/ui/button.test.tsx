import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../../../src/components/ui/button";

describe("Button", () => {
  it("should render the button with the correct text", () => {
    render(<Button>Click me</Button>);

    const buttonElement = screen.getByRole("button", { name: /click me/i });

    expect(buttonElement).toBeInTheDocument();
  });

  it("should render the button with the correct variant", () => {
    render(<Button variant="outline">Click me</Button>);

    const buttonElement = screen.getByRole("button", { name: /click me/i });

    expect(buttonElement).toHaveClass("border");
  });
});
