import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedMethods, contactDetails, subject, message } = body;

    if (!selectedMethods?.length || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          selected_methods: selectedMethods,
          contact_details: contactDetails,
          subject,
          message,
          created_at: new Date().toISOString(),
          read: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhookUrl) {
      const methodsList = selectedMethods
        .map((id: string) => {
          const detail = contactDetails?.[id];
          return detail ? `**${id}**: ${detail}` : `**${id}**`;
        })
        .join("\n");

      const discordPayload = {
        username: "Dnzx - Contact Form",
        avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
        embeds: [
          {
            title: "Nova mensagem de contato",
            color: 0x2b2d31,
            fields: [
              {
                name: "Assunto",
                value: subject,
                inline: false,
              },
              {
                name: "Métodos de contato",
                value: methodsList || "N/A",
                inline: false,
              },
              {
                name: "Mensagem",
                value:
                  message.length > 1024
                    ? message.slice(0, 1021) + "..."
                    : message,
                inline: false,
              },
            ],
            footer: {
              text: `ID: ${data.id}`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload),
      });
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
