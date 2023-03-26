import Contact from './Contact';

const contactList = [{ name: 'Bill' }, { name: 'Steve' }, { name: 'Chris' }];

export default function ContactList() {
  return (
    <ul className='h-1/2 w-full bg-gray-600 flex flex-col justify-center items-center'>
      {contactList.map((contact) => {
        return (
          <li>
            <Contact contact={contact} />
          </li>
        );
      })}
    </ul>
  );
}
