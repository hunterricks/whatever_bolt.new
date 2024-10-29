"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

interface PortfolioSectionProps {
  form: UseFormReturn<any>;
}

export default function PortfolioSection({ form }: PortfolioSectionProps) {
  const [items, setItems] = useState([{ title: "", description: "", url: "" }]);

  const addItem = () => {
    if (items.length < 5) {
      const newItems = [...items, { title: "", description: "", url: "" }];
      setItems(newItems);
      form.setValue('portfolio', newItems);
    }
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    form.setValue('portfolio', newItems);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    form.setValue('portfolio', newItems);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Portfolio Items (Optional)</h3>
      {items.map((item, index) => (
        <Card key={index}>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name={`portfolio.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={item.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      placeholder="e.g., Kitchen Renovation Project"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`portfolio.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Describe this portfolio item..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`portfolio.${index}.url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={item.url}
                      onChange={(e) => updateItem(index, 'url', e.target.value)}
                      placeholder="https://"
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {index > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => removeItem(index)}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Remove Item
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {items.length < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Portfolio Item
        </Button>
      )}
    </div>
  );
}