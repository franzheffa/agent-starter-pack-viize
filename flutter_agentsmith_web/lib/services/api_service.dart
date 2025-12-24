import 'package:http/http.dart' as http;
import 'dart:convert';

class AgentSmithHeffaService {
  static const String baseUrl = 'https://www.buttertech.io/api/camera/stream';

  Future<void> sendVisionData(String cameraId, Map visionData) async {
    final url = Uri.parse(baseUrl);
    
    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          'cameraId': cameraId,
          'visionData': visionData,
        }),
      );

      if (response.statusCode == 200) {
        print("agent-smith-heffa : SYSTÈME OK - Données synchronisées");
      } else {
        print("agent-smith-heffa : ERREUR GATEWAY ${response.statusCode}");
      }
    } catch (e) {
      print("agent-smith-heffa : ÉCHEC CONNEXION $e");
    }
  }
}
