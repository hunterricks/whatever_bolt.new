"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              WHATEVER™ ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2">2.1 Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and contact information</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing and payment information</li>
              <li>Profile information</li>
            </ul>

            <h3 className="text-xl font-medium mb-2">2.2 Usage Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Log data and device information</li>
              <li>Location data</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6">
              <li>To provide and maintain our services</li>
              <li>To process your transactions</li>
              <li>To communicate with you</li>
              <li>To improve our services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6">
              <li>Service providers and business partners</li>
              <li>Legal authorities when required</li>
              <li>Other users as part of the platform functionality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6">
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
            </ul>
            <div className="mt-4">
              <h3 className="text-xl font-medium mb-2">6.1 Data Deletion</h3>
              <p className="mb-4">
                You can request the deletion of your account and all associated data at any time. To delete your account:
              </p>
              <ol className="list-decimal pl-6 mb-4">
                <li>Go to Account Settings</li>
                <li>Select "Delete Account"</li>
                <li>Follow the confirmation process</li>
              </ol>
              <Button asChild>
                <Link href="/account/delete">Delete Your Account</Link>
              </Button>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:{" "}
              <Link href="mailto:privacy@whatever.org" className="text-primary hover:underline">
                privacy@whatever.org
              </Link>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              By using our platform, you agree to the terms of this Privacy Policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}