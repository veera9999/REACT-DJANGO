from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer

    def get(self, request, format=None):
        code = request.GET.get('code', None)
        if code:
            room = get_object_or_404(Room, code=code)
            data = RoomSerializer(room).data
            data['is_host'] = request.session.session_key == room.host # type: ignore
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not request.session.exists(request.session.session_key):
            request.session.create()

        serializer = self.serializer_class(data=request.data)
        assert isinstance(serializer.validated_data, dict), "validated_data must be a dictionary"
        if serializer.is_valid():
            guest_can_pause = serializer.validated_data['guest_can_pause']
            votes_to_skip = serializer.validated_data['votes_to_skip']
            host = request.session.session_key
            room, created = Room.objects.update_or_create(
                host=host,
                defaults={'guest_can_pause': guest_can_pause, 'votes_to_skip': votes_to_skip},
            )
            if created:
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
            else:
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
