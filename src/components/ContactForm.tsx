import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';
import type { Message } from '../schemas/zodSchema';
import { messageSchema } from '../schemas/zodSchema';
import { api } from '../utils/api';

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Message>({
    resolver: zodResolver(messageSchema),
    mode: 'onTouched',
  });

  const { executeRecaptcha } = useGoogleReCaptcha();
  const sendMessage = api.contact.sendMessage.useMutation({
    onSuccess: () => reset(),
  });

  const onSubmit = async (message: Message) => {
    if (!executeRecaptcha) return;
    const token = await executeRecaptcha('contact_form');

    sendMessage.mutate({ ...message, token });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="my-2 block">
        Email
        <input
          type="email"
          {...register('email')}
          className="block w-full rounded-md bg-stone-700 p-2"
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </label>
      <label className="my-2 block">
        Subject
        <input
          type="text"
          {...register('subject')}
          className="block w-full rounded-md bg-stone-700 p-2"
        />
        {errors.subject && (
          <p className="text-sm text-red-400">{errors.subject.message}</p>
        )}
      </label>
      <label className="my-2 block">
        Text
        <textarea
          {...register('text')}
          className="block w-full rounded-md bg-stone-700 p-2"
        />
        {errors.text && (
          <p className="text-sm text-red-400">{errors.text.message}</p>
        )}
      </label>
      <input
        type="submit"
        value="Send message"
        disabled={!isValid || !executeRecaptcha || sendMessage.isLoading}
        className="cursor-pointer
        rounded-md bg-stone-700 p-2
        text-left transition-opacity
        hover:opacity-90
        active:opacity-80
        disabled:cursor-not-allowed disabled:opacity-50
        disabled:hover:opacity-50
        disabled:active:opacity-50"
      />
      {sendMessage.isSuccess && (
        <span className="p-2 text-sm text-green-400">Message sent!</span>
      )}
      {sendMessage.isError && (
        <span className="p-2 text-sm text-red-400">
          {sendMessage.error.message ||
            'Something went wrong, please try again later.'}
        </span>
      )}
    </form>
  );
};

export default ContactForm;
