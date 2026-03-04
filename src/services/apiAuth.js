import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

// React 的状态（State）和 React Query 的缓存（Cache）都存储在浏览器的 内存 中。
// 如果没有 getCurrentUser ：当用户刷新浏览器页面时，内存会被清空，应用会认为用户没有登录，直接把用户踢回登录页。
// 有了 getCurrentUser ：应用启动时会调用它。它会去检查浏览器的 localStorage （Supabase 自动存储在那里的 Token），然后向服务器验证这个 Token 是否依然有效。如果有效，就重新填充缓存，让用户保持登录状态。

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  // 虽然可以直接从session（对话）中获取用户，但是从supabase中获取更安全
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  // 1. Update password or fullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } }; // 和signup中的格式一样

  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  if (!avatar) return data;

  // 2. Upload the avatar image
  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);
  // 将用户上传的头像图片保存到 Supabase 的云端存储中

  if (storageError) throw new Error(storageError.message);
  // 3. Update avatar in the user
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });

  if (error2) throw new Error(error2.message);
  return updatedUser;
}
