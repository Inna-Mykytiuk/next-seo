import ClapButton from "@/components/ClapButton";
import { delay } from "@/lib/utils";
import { BlogPost, BlogPostsResponse } from "@/models/BlogPost";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

// interface BlogPostPageProps {
//   params: Promise<{ postId: string }>
// }

export async function generateStaticParams() {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  // Исправление: возвращаем массив объектов с postId в виде строки
  return posts.map(({ id }) => ({ postId: id.toString() }));
}

// Manually deduplicate requests if not using fetch
// const getPost = cache(async (postId: string) => {
//   const post = await prisma.post.findUnique(postId);
//   return post;
// })

export async function generateMetadata(props: {
  params: Promise<{ postId: string }>,
}): Promise<Metadata> {
  // Сначала дожидаемся params перед использованием его свойств
  // const paramsData = await params;
  const { postId } = await props.params;

  const response = await fetch(`https://dummyjson.com/posts/${postId}`);
  const post: BlogPost = await response.json();

  return {
    title: post.title,
    description: post.body,
    // openGraph: {
    //   images: [
    //     {
    //       url: post.imageUrl
    //     }
    //   ]
    // }
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ postId: string }>,
}) {
  // Сначала дожидаемся params перед использованием его свойств
  // const paramsData = await params;
  const { postId } = await props.params;

  const response = await fetch(`https://dummyjson.com/posts/${postId}`);

  if (response.status === 404) {
    notFound();
  }

  const post: BlogPost = await response.json();

  await delay(1000);

  return (
    <article className="max-w-prose m-auto space-y-5">
      <h1 className="text-3xl text-center font-bold">{post.title}</h1>
      <p className="text-lg">{post.body}</p>
      <ClapButton />
    </article>
  );
}