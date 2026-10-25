"use client";

import { useState, type FormEvent } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const categories = ["Beach", "Adventure", "Cultural", "City", "Nature"];

type PackageForm = {
    name: string;
    country: string;
    category: string;
    price: string;
    duration: string;
    departureDate: string;
    imageUrl: string;
    description: string;
};

const initialForm: PackageForm = {
    name: "",
    country: "",
    category: "",
    price: "",
    duration: "",
    departureDate: "",
    imageUrl: "",
    description: "",
};

const fieldClassName = "h-9 bg-muted border-transparent md:text-sm";

export default function AddDestinationPage() {
    const [form, setForm] = useState<PackageForm>(initialForm);
    const [error, setError] = useState<string | null>(null);

    const updateField = (field: keyof PackageForm, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    console.log(form)
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const res = await fetch('http://localhost:8000/add-destination', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });


        const data = await res.json();
        console.log('Api working',data);
        

        const missing = (
            [
                ["name", "Destination Name"],
                ["country", "Country"],
                ["category", "Category"],
                ["price", "Price (USD)"],
            ] as const
        )
            .filter(([field]) => !form[field])
            .map(([, label]) => label);

        if (missing.length > 0) {
            setError(`Please fill in: ${missing.join(", ")}`);
            return;
        }

        setError(null);
        console.log("New travel package:", form);
    };

    const handleCancel = () => {
        setForm(initialForm);
        setError(null);
    };

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-12 md:py-16">
            <h1 className="text-center mb-10 text-3xl font-normal md:text-4xl">
                Add New Travel Package
            </h1>

            <Card className="mx-auto max-w-lg py-8 shadow-sm ring-border">
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5">
                        {/* Destination Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Destination Name</Label>
                            <Input
                                id="name"
                                placeholder="Bali Paradise"
                                className={fieldClassName}
                                value={form.name}
                                onChange={(e) => updateField("name", e.target.value)}
                            />
                        </div>

                        {/* Country + Category */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    placeholder="Indonesia"
                                    className={fieldClassName}
                                    value={form.country}
                                    onChange={(e) => updateField("country", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={form.category}
                                    onValueChange={(value) => {
                                        if (value !== null) updateField("category", value);
                                    }}
                                >
                                    <SelectTrigger
                                        id="category"
                                        className={`w-full ${fieldClassName}`}
                                    >
                                        <SelectValue placeholder="Beach" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Price + Duration */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (USD)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    placeholder="e.g., 1299"
                                    className={fieldClassName}
                                    value={form.price}
                                    onChange={(e) => updateField("price", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    placeholder="e.g., 7 Days/6 Nights"
                                    className={fieldClassName}
                                    value={form.duration}
                                    onChange={(e) => updateField("duration", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Departure Date */}
                        <div className="space-y-2">
                            <Label htmlFor="departureDate">Departure Date</Label>
                            <Input
                                id="departureDate"
                                type="date"
                                className={fieldClassName}
                                value={form.departureDate}
                                onChange={(e) => updateField("departureDate", e.target.value)}
                            />
                        </div>

                        {/* Image URL */}
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className={fieldClassName}
                                value={form.imageUrl}
                                onChange={(e) => updateField("imageUrl", e.target.value)}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the travel experience..."
                                className="min-h-28 bg-muted border-transparent md:text-sm"
                                value={form.description}
                                onChange={(e) => updateField("description", e.target.value)}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="mt-6 justify-between gap-4 border-border/70 bg-transparent">
                        <p role="alert" className="text-sm text-destructive">
                            {error}
                        </p>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-9 border-destructive/40 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={handleCancel}
                            >
                                <Trash2 />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9 bg-cyan-600 px-4 text-white hover:bg-cyan-700"
                            >
                                <Save />
                                Add Travel Package
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
}
