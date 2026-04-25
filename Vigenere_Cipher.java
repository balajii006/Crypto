import java.util.Scanner;

public class VigenereCipher {

    // Extend key to match string length cyclically
    static String generateKey(String str, String key) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            result.append(key.charAt(i % key.length()));
        }
        return result.toString();
    }

    // Encrypt the text
    static String encrypt(String str, String key) {
        StringBuilder cipher = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            int x = (str.charAt(i) + key.charAt(i)) % 26;
            x += 'A';
            cipher.append((char) x);
        }
        return cipher.toString();
    }

    // Decrypt the text
    static String decrypt(String cipher, String key) {
        StringBuilder original = new StringBuilder();
        for (int i = 0; i < cipher.length(); i++) {
            int x = (cipher.charAt(i) - key.charAt(i) + 26) % 26;
            x += 'A';
            original.append((char) x);
        }
        return original.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter the text    : ");
        String str = sc.nextLine().toUpperCase();

        System.out.print("Enter the keyword : ");
        String keyword = sc.nextLine().toUpperCase();

        String key        = generateKey(str, keyword);
        String encrypted  = encrypt(str, key);
        String decrypted  = decrypt(encrypted, key);

        System.out.println("\nKey Generated : " + key);
        System.out.println("Encrypted     : " + encrypted);
        System.out.println("Decrypted     : " + decrypted);

        sc.close();
    }
}
```

---

### Sample Output:
```
Enter the text    : GEEKSFORGEEKS
Enter the keyword : AYUSH

Key Generated : AYUSHAYUSHAYS
Encrypted     : GCYCZFMLYLEIM
Decrypted     : GEEKSFORGEEKS
